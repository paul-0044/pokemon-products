import xml.etree.ElementTree as ET
import urllib.request
import json

HEADERS = {'User-Agent': 'Mozilla/5.0'}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read()

def parse_sitemap_file(url):
    content = fetch(url)
    root = ET.fromstring(content)
    
    # namespaces
    # default xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    # xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    page_urls = []
    image_urls = []
    
    for url_elem in root.findall('{http://www.sitemaps.org/schemas/sitemap/0.9}url'):
        loc_elem = url_elem.find('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')
        if loc_elem is not None and loc_elem.text:
            page_urls.append(loc_elem.text)
            
        for img in url_elem.findall('{http://www.google.com/schemas/sitemap-image/1.1}image'):
            img_loc = img.find('{http://www.google.com/schemas/sitemap-image/1.1}loc')
            img_title = img.find('{http://www.google.com/schemas/sitemap-image/1.1}title')
            if img_loc is not None and img_loc.text:
                image_urls.append({
                    'page': loc_elem.text if loc_elem is not None else '',
                    'image': img_loc.text,
                    'title': img_title.text if img_title is not None else ''
                })
                
    return page_urls, image_urls

# Test with pages and collections
p_urls, p_imgs = parse_sitemap_file('https://ptccollectibles.com/sitemap_pages_1.xml?from=74571677857&to=117197308065')
print("Pages URLs count:", len(p_urls))
for p in p_urls:
    print("  Page:", p)

c_urls, c_imgs = parse_sitemap_file('https://ptccollectibles.com/sitemap_collections_1.xml?from=238331494561&to=334154596513')
print("\nCollections URLs count:", len(c_urls))
print("Collections Images count:", len(c_imgs))
for c in c_urls[:15]:
    print("  Collection:", c)
