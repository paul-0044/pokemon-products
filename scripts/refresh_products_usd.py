import urllib.request
import json
import time
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
}

CAD_TO_USD_RATE = 0.74

def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    os.makedirs('crawler_data/products', exist_ok=True)
    all_products = []
    page = 1
    total_variants = 0

    print("Fetching live clean catalog from https://ptccollectibles.com/products.json...")
    while True:
        url = f'https://ptccollectibles.com/products.json?limit=250&page={page}'
        try:
            data = fetch_json(url)
            products = data.get('products', [])
            if not products:
                break
            
            for p in products:
                for v in p.get('variants', []):
                    total_variants += 1
                    try:
                        raw_cad = float(v.get('price') or 0)
                        usd_val = round(raw_cad * CAD_TO_USD_RATE, 2)
                        v['price_cad'] = f"{raw_cad:.2f}"
                        v['price_usd'] = f"{usd_val:.2f}"
                        v['price'] = f"{usd_val:.2f}" # default currency USD

                        if v.get('compare_at_price'):
                            raw_comp_cad = float(v.get('compare_at_price'))
                            comp_usd_val = round(raw_comp_cad * CAD_TO_USD_RATE, 2)
                            v['compare_at_price_cad'] = f"{raw_comp_cad:.2f}"
                            v['compare_at_price_usd'] = f"{comp_usd_val:.2f}"
                            v['compare_at_price'] = f"{comp_usd_val:.2f}"
                        else:
                            v['compare_at_price'] = None
                            v['compare_at_price_cad'] = None
                            v['compare_at_price_usd'] = None
                    except Exception as err:
                        print(f"Error converting variant {v.get('id')}: {err}")

            all_products.extend(products)
            print(f"  Page {page}: {len(products)} products (Cumulative: {len(all_products)})")

            if len(products) < 250:
                break
            page += 1
            time.sleep(0.3)
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break

    output_path = 'crawler_data/products/all_products.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    print(f"\nSaved {len(all_products)} products and {total_variants} variants with accurate USD prices to {output_path}!")

if __name__ == '__main__':
    main()
