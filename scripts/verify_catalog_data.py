import json

with open('crawler_data/products/all_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Total Products: {len(products)}")

sample = products[0]
print("\nSample Product Keys:", list(sample.keys()))
print("Title:", sample.get('title'))
print("Handle:", sample.get('handle'))
print("Vendor:", sample.get('vendor'))
print("Product Type:", sample.get('product_type'))
print("Tags count:", len(sample.get('tags', [])))
print("Variants count:", len(sample.get('variants', [])))
if sample.get('variants'):
    print("  First Variant Keys:", list(sample['variants'][0].keys()))
    print("  First Variant Price:", sample['variants'][0].get('price'))
print("Images count:", len(sample.get('images', [])))
if sample.get('images'):
    print("  First Image URL:", sample['images'][0].get('src'))
print("Options count:", len(sample.get('options', [])))
