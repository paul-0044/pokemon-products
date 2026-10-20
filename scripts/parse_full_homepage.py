from bs4 import BeautifulSoup
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

with open('crawler_data/homepage.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f, 'html.parser')

data = {}

# 1. Meta & Head
title = soup.find('title')
data['title'] = title.text.strip() if title else ""

desc = soup.find('meta', attrs={'name': 'description'})
data['description'] = desc['content'].strip() if desc else ""

# 2. Announcement Bar
announcements = []
for el in soup.select('.announcement-bar, [class*="announcement"]'):
    text = el.get_text(separator=' ', strip=True)
    if text and text not in announcements:
        announcements.append(text)
data['announcements'] = announcements

# 3. Header & Logo
header = soup.find('header')
logo = None
if header:
    img = header.find('img')
    if img:
        logo = img.get('src') or img.get('data-src')
data['header_logo'] = logo

# 4. Navigation Menu
menu_items = []
nav = soup.find('nav', class_=re.compile(r'header__inline-menu|header__menu'))
if not nav:
    nav = soup.find('nav')

if nav:
    # Find top level li
    for li in nav.find_all('li', recursive=False):
        a = li.find('a')
        if not a:
            summary = li.find('summary')
            if summary:
                a = summary
        if a:
            item_text = a.get_text(strip=True)
            item_href = a.get('href', '#')
            
            # Check for dropdown sub-items
            children = []
            sub_ul = li.find('ul')
            if sub_ul:
                for sub_a in sub_ul.find_all('a'):
                    children.append({
                        'title': sub_a.get_text(strip=True),
                        'url': sub_a.get('href', '')
                    })
            menu_items.append({
                'title': item_text,
                'url': item_href,
                'children': children
            })
data['navigation_menu'] = menu_items

# 5. Sections in Main
main_el = soup.find('main')
sections_data = []
if main_el:
    sections = main_el.find_all(['section', 'div'], class_=re.compile(r'shopify-section|section-'))
    for s in sections:
        sec_id = s.get('id', '')
        sec_class = s.get('class', [])
        
        # heading
        h = s.find(['h1', 'h2', 'h3'])
        heading_text = h.get_text(strip=True) if h else ""
        
        # images
        imgs = [img.get('src') or img.get('data-src') for img in s.find_all('img') if img.get('src') or img.get('data-src')]
        # filter out tracking 1x1
        imgs = [im for im in imgs if im and not 'tracking' in im and not im.startswith('data:')]
        
        # links
        links = []
        for lk in s.find_all('a'):
            lt = lk.get_text(strip=True)
            lh = lk.get('href', '')
            if lt and lh:
                links.append({'text': lt, 'href': lh})
                
        if heading_text or imgs or links:
            sections_data.append({
                'id': sec_id,
                'class': ' '.join(sec_class) if isinstance(sec_class, list) else str(sec_class),
                'heading': heading_text,
                'images_sample': imgs[:6],
                'links_sample': links[:8]
            })
data['sections'] = sections_data

# 6. Footer
footer = soup.find('footer')
footer_blocks = []
if footer:
    for block in footer.find_all(['div', 'nav'], class_=re.compile(r'footer-block|footer__item')):
        title_el = block.find(['h2', 'h3', 'p', 'summary'], class_=re.compile(r'heading|title'))
        btitle = title_el.get_text(strip=True) if title_el else ""
        blinks = [{'text': a.get_text(strip=True), 'href': a.get('href', '')} for a in block.find_all('a') if a.get_text(strip=True)]
        if btitle or blinks:
            footer_blocks.append({
                'title': btitle,
                'links': blinks
            })
            
    # Payment icons in footer
    payment_icons = [img.get('src') for img in footer.find_all('img') if 'payment' in (img.get('src', '') + img.get('class', [''])[0])]
    data['footer_payment_icons'] = payment_icons
    
    # Copyright
    copy_el = footer.find(class_=re.compile(r'copyright'))
    data['footer_copyright'] = copy_el.get_text(strip=True) if copy_el else ""
    
data['footer_blocks'] = footer_blocks

# 7. Collect all high-res assets & images from homepage
all_images = set()
for img in soup.find_all('img'):
    src = img.get('src') or img.get('data-src') or img.get('srcset')
    if src:
        # If srcset, pick largest
        if ' ' in src and ',' in src:
            parts = [p.strip().split(' ')[0] for p in src.split(',')]
            all_images.add(parts[-1])
        else:
            all_images.add(src)
            
data['all_images_count'] = len(all_images)
data['sample_images'] = list(all_images)[:50]

with open('crawler_data/homepage_detailed.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Homepage Detailed Parsing Complete!")
print("Title:", data['title'])
print(f"Announcements: {len(data['announcements'])}")
for a in data['announcements']:
    print("  Announcement:", a)
print("Header Logo:", data['header_logo'])
print(f"Navigation menu items ({len(data['navigation_menu'])}):")
for item in data['navigation_menu']:
    print(f"  {item['title']} ({len(item['children'])} sub-items) -> {item['url']}")
    for sub in item['children'][:5]:
        print(f"    - {sub['title']} -> {sub['url']}")
print(f"Sections detected: {len(data['sections'])}")
for sec in data['sections']:
    print(f"  [{sec['id']}] {sec['heading']} (imgs: {len(sec['images_sample'])}, links: {len(sec['links_sample'])})")
print(f"Footer blocks: {len(data['footer_blocks'])}")
for fb in data['footer_blocks']:
    print(f"  Footer Block: '{fb['title']}' with {len(fb['links'])} links")
print(f"Total unique images extracted on homepage: {len(all_images)}")
