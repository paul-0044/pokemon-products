import os, re

found = set()
for root, dirs, files in os.walk('crawler_data'):
    for f in files:
        if f.endswith('.json') or f.endswith('.html'):
            p = os.path.join(root, f)
            with open(p, 'r', encoding='utf-8', errors='ignore') as fp:
                txt = fp.read()
                matches = re.findall(r'(?:https?:)?//ptccollectibles\.com/cdn/shop/(?:files|collections)/[^\s"\'<>]+', txt)
                for m in matches:
                    if any(k in m.lower() for k in ['banner', 'hero', 'header', 'promo', 'carousel']):
                        found.add(m)

print(f"Total banners/heroes found: {len(found)}")
for u in sorted(found):
    print(u)
