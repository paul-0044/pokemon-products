import urllib.request
import json
import time
import os

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode('utf-8'))

def retry_collections():
    with open('public/data/collection_products.json', 'r', encoding='utf-8') as f:
        col_map = json.load(f)

    with open('public/data/products.json', 'r', encoding='utf-8') as f:
        all_products = json.load(f)

    products_by_id = {p['id']: p for p in all_products}

    targets = ['dragon-ball-tcg', 'other-tcg', 'pokemon-booster-boxes', 'on-sale']

    for handle in targets:
        print(f"Retrying mapping for {handle}...")
        page = 1
        handles = col_map.get(handle, [])
        if len(handles) < 10:
            handles = []

        while True:
            url = f'https://ptccollectibles.com/collections/{handle}/products.json?limit=250&page={page}'
            try:
                data = fetch_json(url)
                prods = data.get('products', [])
                if not prods:
                    break
                for p in prods:
                    p_handle = p.get('handle')
                    p_id = p.get('id')
                    if p_handle not in handles:
                        handles.append(p_handle)
                    if p_id in products_by_id and handle not in products_by_id[p_id].get('collections', []):
                        if 'collections' not in products_by_id[p_id]:
                            products_by_id[p_id]['collections'] = []
                        products_by_id[p_id]['collections'].append(handle)

                if len(prods) < 250:
                    break
                page += 1
                time.sleep(0.4)
            except Exception as e:
                print(f"  Error on page {page}: {e}")
                break

        col_map[handle] = handles
        print(f"  -> Now has {len(handles)} products for {handle}")

    with open('public/data/collection_products.json', 'w', encoding='utf-8') as f:
        json.dump(col_map, f, indent=2)

    with open('public/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    with open('crawler_data/products/all_products.json', 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print("Retry complete! All collection mappings updated.")

if __name__ == '__main__':
    retry_collections()
