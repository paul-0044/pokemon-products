import json
import re
import os

def parse_html_meta(html_path):
    with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    meta = {}
    
    # Title
    title_match = re.search(r'<title>(.*?)</title>', content, re.DOTALL | re.IGNORECASE)
    if title_match:
        meta['title'] = title_match.group(1).strip()

    # Meta description
    desc_match = re.search(r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE)
    if desc_match:
        meta['description'] = desc_match.group(1).strip()

    # Canonical
    canon_match = re.search(r'<link\s+rel=["\']canonical["\']\s+href=["\'](.*?)["\']', content, re.IGNORECASE)
    if canon_match:
        meta['canonical'] = canon_match.group(1).strip()

    # Favicon
    icon_match = re.search(r'<link\s+rel=["\']icon["\'].*?href=["\'](.*?)["\']', content, re.IGNORECASE)
    if icon_match:
        meta['favicon'] = icon_match.group(1).strip()

    # OG Tags
    og_tags = {}
    for m in re.finditer(r'<meta\s+property=["\'](og:[^"\']+)["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE):
        og_tags[m.group(1)] = m.group(2).strip()
    meta['open_graph'] = og_tags

    # Twitter Tags
    tw_tags = {}
    for m in re.finditer(r'<meta\s+name=["\'](twitter:[^"\']+)["\']\s+content=["\'](.*?)["\']', content, re.IGNORECASE):
        tw_tags[m.group(1)] = m.group(2).strip()
    meta['twitter'] = tw_tags

    # CSS Variables / Color Palette
    colors = {}
    color_matches = re.findall(r'(--color-[a-zA-Z0-9_-]+):\s*([^;]+);', content)
    for var_name, var_val in color_matches:
        colors[var_name] = var_val.strip()
    meta['color_tokens'] = colors

    # Typography / Font families
    fonts = set(re.findall(r'font-family:\s*([^;]+);', content))
    meta['font_families'] = list(fonts)[:10]

    return meta

def main():
    home_path = r'C:\Users\ngole\.gemini\antigravity-ide\brain\cb557bf2-d9aa-496c-b17d-c83fd4a2aab7\.system_generated\steps\7\content.md'
    meta = parse_html_meta(home_path)
    
    with open('crawler_data/homepage_meta.json', 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2)

    print("Parsed Homepage Metadata:")
    print("  Title:", meta.get('title'))
    print("  Description:", meta.get('description'))
    print("  Canonical:", meta.get('canonical'))
    print("  Favicon:", meta.get('favicon'))
    print(f"  OG tags count: {len(meta.get('open_graph', {}))}")
    print(f"  Color tokens count: {len(meta.get('color_tokens', {}))}")
    print("  Font families:", meta.get('font_families'))

if __name__ == '__main__':
    main()
