import urllib.request
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    with open('crawler_data/collections/collections.json', 'r', encoding='utf-8') as f:
        collections = json.load(f)

    with open('crawler_data/products/all_products.json', 'r', encoding='utf-8') as f:
        all_products = json.load(f)

    # Product handle index
    products_by_id = {p['id']: p for p in all_products}
    for p in all_products:
        p['collections'] = []

    collection_map = {}

    print(f"Mapping products for all {len(collections)} collections...")

    for col in collections:
        handle = col['handle']
        title = col['title']
        expected_count = col.get('products_count', 0)
        print(f"Processing '{title}' ({handle}) - Expected: {expected_count}...")

        if expected_count == 0:
            collection_map[handle] = []
            continue

        # If it's best-sellers, it contains all products
        if handle == 'best-sellers':
            collection_map[handle] = [p['handle'] for p in all_products]
            for p in all_products:
                p['collections'].append(handle)
            continue

        product_handles = []
        page = 1

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
                    product_handles.append(p_handle)
                    
                    if p_id in products_by_id:
                        if handle not in products_by_id[p_id]['collections']:
                            products_by_id[p_id]['collections'].append(handle)

                if len(prods) < 250:
                    break
                page += 1
                time.sleep(0.2)
            except Exception as e:
                print(f"  Error fetching {handle} page {page}: {e}")
                break

        collection_map[handle] = product_handles
        print(f"  -> Mapped {len(product_handles)} products for {handle}")
        time.sleep(0.2)

    # Save collection_products.json
    out_map_path = 'public/data/collection_products.json'
    with open(out_map_path, 'w', encoding='utf-8') as f:
        json.dump(collection_map, f, indent=2)

    with open('crawler_data/collections/collection_products.json', 'w', encoding='utf-8') as f:
        json.dump(collection_map, f, indent=2)

    # Save enriched products with their collections array
    with open('crawler_data/products/all_products.json', 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    with open('public/data/products.json', 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print("\n================ MAPPING COMPLETE ================")
    print(f"Successfully saved collection mapping to {out_map_path}")
    print("Updated public/data/products.json with exact collection memberships!")

if __name__ == '__main__':
    main()
