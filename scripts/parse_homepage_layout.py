import re
import json

home_path = r'C:\Users\ngole\.gemini\antigravity-ide\brain\cb557bf2-d9aa-496c-b17d-c83fd4a2aab7\.system_generated\steps\7\content.md'
with open(home_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Announcement bar
announcements = []
for m in re.finditer(r'<div[^>]*class="[^"]*announcement-bar[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL):
    text = re.sub(r'<[^>]+>', ' ', m.group(1)).strip()
    text = re.sub(r'\s+', ' ', text)
    if text:
        announcements.append(text)

# Also search for announcement text broadly
announcement_broad = re.findall(r'announcement[^>]*>\s*<p[^>]*>(.*?)</p>', html, re.IGNORECASE | re.DOTALL)
for a in announcement_broad:
    clean = re.sub(r'<[^>]+>', '', a).strip()
    if clean and clean not in announcements:
        announcements.append(clean)

# 2. Header Logo
logo_match = re.search(r'<img[^>]*class="[^"]*header__heading-logo[^"]*"[^>]*src="([^"]+)"', html)
if not logo_match:
    logo_match = re.search(r'<header[^>]*>.*?<img[^>]*src="([^"]+)"', html, re.DOTALL)
logo_url = logo_match.group(1) if logo_match else ""

# 3. Header Navigation Links
nav_links = []
# Find header nav items
for nav_match in re.finditer(r'<header[^>]*>(.*?)</header>', html, re.DOTALL):
    header_html = nav_match.group(1)
    # find list items or links
    for link in re.finditer(r'<a\s+href="([^"]+)"[^>]*class="[^"]*header__menu-item[^"]*"[^>]*>(.*?)</a>', header_html, re.DOTALL):
        href = link.group(1)
        text = re.sub(r'<[^>]+>', '', link.group(2)).strip()
        nav_links.append({'text': text, 'url': href})

# Also extract all links inside header if empty
if not nav_links:
    for link in re.finditer(r'<nav[^>]*header__inline-menu[^>]*>(.*?)</nav>', html, re.DOTALL):
        for a in re.finditer(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', link.group(1), re.DOTALL):
            t = re.sub(r'<[^>]+>', '', a.group(2)).strip()
            if t:
                nav_links.append({'text': t, 'url': a.group(1)})

# 4. Sections present on Homepage
sections = []
for sec in re.finditer(r'<section\s+id="([^"]+)"[^>]*class="([^"]+)"', html):
    sections.append({'id': sec.group(1), 'class': sec.group(2)})

# 5. Extract banner images / hero images
hero_images = []
for img in re.finditer(r'<div[^>]*class="[^"]*(banner|slideshow|image-with-text)[^"]*"[^>]*>.*?<img[^>]*src="([^"]+)"', html, re.DOTALL):
    hero_images.append(img.group(2))

# 6. Extract footer links
footer_links = []
footer_match = re.search(r'<footer[^>]*>(.*?)</footer>', html, re.DOTALL)
if footer_match:
    f_html = footer_match.group(1)
    for a in re.finditer(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', f_html, re.DOTALL):
        t = re.sub(r'<[^>]+>', '', a.group(2)).strip()
        u = a.group(1)
        if t and not u.startswith('#'):
            footer_links.append({'text': t, 'url': u})

layout_info = {
    'announcements': announcements,
    'logo_url': logo_url,
    'nav_links': nav_links,
    'sections_count': len(sections),
    'sections': sections[:15],
    'hero_images': hero_images[:5],
    'footer_links_count': len(footer_links),
    'footer_links': footer_links
}

with open('crawler_data/homepage_layout.json', 'w', encoding='utf-8') as f:
    json.dump(layout_info, f, indent=2)

print("Homepage Layout Analysis:")
print("Announcements:", announcements)
print("Logo URL:", logo_url)
print(f"Navigation Links ({len(nav_links)}):")
for n in nav_links:
    print(f"  {n['text']} -> {n['url']}")
print(f"Sections ({len(sections)} total):")
for s in sections[:8]:
    print(f"  {s['id']} ({s['class']})")
print(f"Footer Links ({len(footer_links)} total):")
for f in footer_links[:10]:
    print(f"  {f['text']} -> {f['url']}")
