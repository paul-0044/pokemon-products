import os
import subprocess
import time

def run(cmd):
    res = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return res.returncode, res.stdout, res.stderr

def push_directory_in_batches(dir_path, dir_name, max_batch_bytes=350 * 1024):
    files = []
    for root, _, filenames in os.walk(dir_path):
        for f in filenames:
            p = os.path.join(root, f).replace('\\', '/')
            files.append((p, os.path.getsize(p)))
    
    files.sort(key=lambda x: x[1])
    
    batch = []
    current_size = 0
    batch_num = 1
    
    for p, size in files:
        batch.append(p)
        current_size += size
        
        if current_size >= max_batch_bytes:
            commit_and_push(batch, dir_name, batch_num, current_size)
            batch = []
            current_size = 0
            batch_num += 1
            time.sleep(2)
            
    if batch:
        commit_and_push(batch, dir_name, batch_num, current_size)

def commit_and_push(file_list, dir_name, batch_num, size_bytes):
    print(f"Staging {dir_name} batch {batch_num} ({len(file_list)} files, {size_bytes / 1024:.1f} KB)...")
    code, out, err = run(f"git add {' '.join(file_list)}")
    if code != 0:
        print(f"git add error: {err}")
        return
        
    code, out, err = run(f'git commit -m "feat: add {dir_name} images batch {batch_num}"')
    if code != 0:
        print(f"git commit output: {out} {err}")
        if "nothing to commit" in out or "nothing to commit" in err:
            return
            
    for attempt in range(1, 4):
        print(f"Pushing {dir_name} batch {batch_num} (attempt {attempt})...")
        code, out, err = run("git push origin main")
        if code == 0:
            print(f"Batch {batch_num} pushed successfully!")
            return
        print(f"Push attempt {attempt} failed: {out} {err}")
        time.sleep(5)
        
    raise RuntimeError(f"Failed to push {dir_name} batch {batch_num} after 3 attempts")

if __name__ == '__main__':
    print("=== Step 1: Pushing collections images ===")
    push_directory_in_batches("public/images/collections", "collections")
    print("=== Step 2: Pushing products images ===")
    push_directory_in_batches("public/images/products", "products")
    print("=== All images pushed successfully! ===")
