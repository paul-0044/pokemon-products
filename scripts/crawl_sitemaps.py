import urllib.request
import urllib.parse
import json
import xml.etree.ElementTree as ET
import os
import re

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch_url(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def main():
    os.makedirs('crawler_data', exist_ok=True)
    
    # 1. Fetch main sitemap
    print("Fetching sitemap.xml...")
    sitemap_xml = fetch_url('https://ptccollectibles.com/sitemap.xml')
    with open('crawler_data/sitemap.xml', 'w', encoding='utf-8') as f:
        f.write(sitemap_xml)
        
    root = ET.fromstring(sitemap_xml)
    sub_sitemaps = [elem.text for elem in root.iter() if elem.tag.endswith('loc')]
    print(f"Found {len(sub_sitemaps)} sub-sitemaps in root sitemap.")
    for s in sub_sitemaps:
        print("  Sub-sitemap:", s)

    # 2. Fetch all URLs from sub-sitemaps
    all_pages = []
    all_products = []
    all_collections = []
    all_blogs = []
    all_articles = []

    for s_url in sub_sitemaps:
        try:
            print(f"Fetching sub-sitemap: {s_url}")
            content = fetch_url(s_url)
            s_root = ET.fromstring(content)
            locs = [elem.text for elem in s_root.iter() if elem.tag.endswith('loc')]
            print(f"  Found {len(locs)} locs in {s_url}")
            
            if 'products' in s_url and not '/fr/' in s_url:
                all_products.extend(locs)
            elif 'pages' in s_url and not '/fr/' in s_url:
                all_pages.extend(locs)
            elif 'collections' in s_url and not '/fr/' in s_url:
                all_collections.extend(locs)
            elif 'blogs' in s_url:
                all_blogs.extend(locs)
            elif 'articles' in s_url:
                all_articles.extend(locs)
        except Exception as e:
            print(f"  Error on {s_url}: {e}")

    # Remove duplicates
    all_pages = sorted(list(set(all_pages)))
    all_products = sorted(list(set(all_products)))
    all_collections = sorted(list(set(all_collections)))
    all_blogs = sorted(list(set(all_blogs)))
    all_articles = sorted(list(set(all_articles)))

    print(f"\nDiscovered counts (EN):")
    print(f"  Pages: {len(all_pages)}")
    print(f"  Collections: {len(all_collections)}")
    print(f"  Products: {len(all_products)}")
    print(f"  Blogs: {len(all_blogs)}")
    print(f"  Articles: {len(all_articles)}")

    with open('crawler_data/indexed_urls.json', 'w', encoding='utf-8') as f:
        json.dump({
            'pages': all_pages,
            'collections': all_collections,
            'products': all_products,
            'blogs': all_blogs,
            'articles': all_articles
        }, f, indent=2)

if __name__ == '__main__':
    main()
