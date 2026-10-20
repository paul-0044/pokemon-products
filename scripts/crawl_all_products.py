import urllib.request
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    os.makedirs('crawler_data/products', exist_ok=True)
    
    all_products = []
    page = 1
    total_variants = 0
    total_images = 0

    print("Starting full catalog crawl from https://ptccollectibles.com/products.json...")
    
    while True:
        url = f'https://ptccollectibles.com/products.json?limit=250&page={page}'
        print(f"Fetching page {page}...")
        try:
            data = fetch_json(url)
            products = data.get('products', [])
            if not products:
                print(f"Page {page} returned 0 products. Reached end of catalog.")
                break
            
            for p in products:
                total_variants += len(p.get('variants', []))
                total_images += len(p.get('images', []))
                
            all_products.extend(products)
            print(f"  Page {page}: retrieved {len(products)} products (Cumulative: {len(all_products)})")
            
            # If less than 250 were returned, this is the last page
            if len(products) < 250:
                print("Last page reached.")
                break
                
            page += 1
            time.sleep(0.4) # respectful delay
        except Exception as e:
            print(f"Error on page {page}: {e}")
            break

    output_path = 'crawler_data/products/all_products.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print("\n================ CRAWL COMPLETE ================")
    print(f"Total Products Downloaded: {len(all_products)}")
    print(f"Total Product Variants: {total_variants}")
    print(f"Total Product Images: {total_images}")
    print(f"Saved complete catalog to: {output_path} ({os.path.getsize(output_path) / (1024*1024):.2f} MB)")

if __name__ == '__main__':
    main()
