import urllib.request
import json
import os
import re
import urllib.parse
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def clean_url(url):
    if not url:
        return ""
    if url.startswith('//'):
        url = 'https:' + url
    elif url.startswith('/'):
        url = 'https://ptccollectibles.com' + url
    return url.split('&')[0] if '&width=' in url else url

def download_file(url, target_path):
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    if os.path.exists(target_path) and os.path.getsize(target_path) > 0:
        return True
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            with open(target_path, 'wb') as f:
                f.write(data)
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

def main():
    assets_dir = 'public/images'
    os.makedirs(f'{assets_dir}/logos', exist_ok=True)
    os.makedirs(f'{assets_dir}/banners', exist_ok=True)
    os.makedirs(f'{assets_dir}/collections', exist_ok=True)
    os.makedirs(f'{assets_dir}/products', exist_ok=True)
    os.makedirs(f'{assets_dir}/badges', exist_ok=True)

    manifest = []

    # 1. Logos
    logo_urls = [
        ('logo_header.png', 'https://ptccollectibles.com/cdn/shop/files/PTC_Logo_7.png?v=1720235845&width=600'),
        ('logo_main.png', 'https://cdn.shopify.com/s/files/1/0532/0792/4897/files/PTC_Logo_8-min.png?v=1792178022'),
        ('favicon.png', 'https://ptccollectibles.com/cdn/shop/files/ChatGPT_Image_Jun_27_2026_11_16_17_PM_6c3514b9-5acb-4a10-bab7-857036ffc977.png?crop=center&height=32&v=1788580180&width=32')
    ]
    for fname, url in logo_urls:
        tpath = f'{assets_dir}/logos/{fname}'
        if download_file(url, tpath):
            manifest.append({'category': 'logo', 'name': fname, 'url': url, 'local_path': f'/images/logos/{fname}'})

    # 2. Collections from collections.json
    with open('crawler_data/collections/collections.json', 'r', encoding='utf-8') as f:
        collections = json.load(f)

    for c in collections:
        img_info = c.get('image')
        if img_info and img_info.get('src'):
            src = clean_url(img_info['src'])
            handle = c.get('handle', 'col')
            fname = f"{handle}.png"
            tpath = f'{assets_dir}/collections/{fname}'
            if download_file(src, tpath):
                manifest.append({'category': 'collection', 'handle': handle, 'name': fname, 'url': src, 'local_path': f'/images/collections/{fname}'})

    # 3. Homepage Banners and Images
    with open('crawler_data/homepage.html', 'r', encoding='utf-8', errors='ignore') as f:
        soup = BeautifulSoup(f, 'html.parser')

    banner_idx = 1
    for img in soup.find_all('img'):
        src = img.get('src') or img.get('data-src')
        if not src or 'tracking' in src or 'analytics' in src:
            continue
        full_url = clean_url(src)
        if 'banner' in full_url.lower() or 'slide' in full_url.lower() or 'hero' in full_url.lower():
            fname = f"hero_banner_{banner_idx}.webp"
            tpath = f'{assets_dir}/banners/{fname}'
            if download_file(full_url, tpath):
                manifest.append({'category': 'banner', 'name': fname, 'url': full_url, 'local_path': f'/images/banners/{fname}'})
                banner_idx += 1
                if banner_idx > 10:
                    break

    # 4. Featured Products on Homepage & First 40 products
    with open('crawler_data/products/products_sample.json', 'r', encoding='utf-8') as f:
        products = json.load(f)

    print(f"Downloading images for top products (sample of 50 featured items)...")
    for p in products[:50]:
        images = p.get('images', [])
        handle = p.get('handle', f"prod_{p.get('id')}")
        for idx, img in enumerate(images[:2]): # first 2 images per product
            src = clean_url(img.get('src'))
            if not src:
                continue
            ext = 'jpg'
            if '.png' in src.lower(): ext = 'png'
            elif '.webp' in src.lower(): ext = 'webp'
            fname = f"{handle}_{idx+1}.{ext}"
            tpath = f'{assets_dir}/products/{fname}'
            if download_file(src, tpath):
                manifest.append({'category': 'product', 'handle': handle, 'name': fname, 'url': src, 'local_path': f'/images/products/{fname}'})

    with open('crawler_data/asset_manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2)

    print(f"Successfully downloaded and indexed {len(manifest)} key media assets into {assets_dir}!")

if __name__ == '__main__':
    main()
