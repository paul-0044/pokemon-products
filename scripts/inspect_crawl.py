import json, os

# Collections
col_path = "crawler_data/collections/collections_full.json"
if os.path.exists(col_path):
    data = json.load(open(col_path, encoding="utf-8"))
    print(f"\n=== COLLECTIONS: {len(data)} total ===")
    for i, c in enumerate(data):
        print(f"  [{i+1:02d}] {c['title']:<40} | products_preview: {len(c['products_preview'])} | banner: {bool(c['banner_image'])}")
else:
    print("collections_full.json not found")

# Products summary
prod_summary = "crawler_data/products/products_summary.json"
if os.path.exists(prod_summary):
    s = json.load(open(prod_summary, encoding="utf-8"))
    print(f"\n=== PRODUCTS SUMMARY ===")
    print(f"  Total products:  {s['total_products']}")
    print(f"  Total variants:  {s['total_variants']}")
    print(f"  Total images:    {s['total_images']}")
    print(f"  Product types:   {s['product_types']}")
    print(f"  Vendors:         {s['vendors'][:10]}")
    print(f"  Option names:    {s['option_names']}")
else:
    print("\nproducts_summary.json not found yet (still crawling...)")

# All products quick stats
prod_path = "crawler_data/products/all_products.json"
if os.path.exists(prod_path):
    prods = json.load(open(prod_path, encoding="utf-8"))
    print(f"\n=== PRODUCTS FILE ===")
    print(f"  Total products: {len(prods)}")
    print(f"  Sample: {[p['title'] for p in prods[:5]]}")
    if prods and prods[0].get("variants"):
        v = prods[0]["variants"][0]
        print(f"  Sample variant price: ${v.get('price')} USD (was CAD: {v.get('price_cad', 'N/A')})")

# Blogs
blog_path = "crawler_data/blogs/all_blogs.json"
if os.path.exists(blog_path):
    blogs = json.load(open(blog_path, encoding="utf-8"))
    print(f"\n=== BLOGS ===")
    for b in blogs:
        print(f"  Blog: {b['title']} | Articles: {len(b['articles'])}")
else:
    print("\nall_blogs.json not found yet")

# Design tokens
dt_path = "crawler_data/design_tokens.json"
if os.path.exists(dt_path):
    dt = json.load(open(dt_path, encoding="utf-8"))
    print(f"\n=== DESIGN TOKENS ===")
    print(f"  CSS Variables: {len(dt['css_variables'])}")
    print(f"  Colors: {dt['colors']}")
    print(f"  Fonts: {dt['fonts']}")
    for k, v in list(dt['css_variables'].items())[:20]:
        print(f"    {k}: {v}")
else:
    print("\ndesign_tokens.json not found yet")
