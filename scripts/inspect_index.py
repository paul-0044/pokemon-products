import json

with open('crawler_data/indexed_urls.json', encoding='utf-8') as f:
    d = json.load(f)

print('=== PAGES ===')
for p in d['pages']:
    print(' ', p)

print(f'\n=== COLLECTIONS ({len(d["collections"])} total) ===')
for c in d['collections']:
    print(' ', c)

print(f'\n=== BLOGS ({len(d["blogs"])} total) ===')
for b in d['blogs']:
    print(' ', b)

print(f'\n=== ARTICLES ({len(d["articles"])} total) ===')
for a in d['articles']:
    print(' ', a)

print(f'\n=== PRODUCTS SAMPLE (first 10 of {len(d["products"])}) ===')
for prod in d['products'][:10]:
    print(' ', prod)
