import json

CAD_TO_USD_RATE = 0.74

with open('crawler_data/products/all_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    for v in p.get('variants', []):
        try:
            cad_price = float(v.get('price', 0))
            usd_price = round(cad_price * CAD_TO_USD_RATE, 2)
            v['price_cad'] = v.get('price')
            v['price'] = f"{usd_price:.2f}"
            v['price_usd'] = f"{usd_price:.2f}"
            
            if v.get('compare_at_price'):
                cad_comp = float(v.get('compare_at_price'))
                usd_comp = round(cad_comp * CAD_TO_USD_RATE, 2)
                v['compare_at_price_cad'] = v.get('compare_at_price')
                v['compare_at_price'] = f"{usd_comp:.2f}"
                v['compare_at_price_usd'] = f"{usd_comp:.2f}"
        except Exception:
            pass

with open('crawler_data/products/all_products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print(f"Successfully converted all variants for {len(products)} products to USD ($)!")
