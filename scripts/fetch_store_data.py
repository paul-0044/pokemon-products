import urllib.request
import json
import os
import time

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def fetch_json(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def fetch_html(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return resp.read().decode('utf-8', errors='ignore')

def main():
    os.makedirs('crawler_data/products', exist_ok=True)
    os.makedirs('crawler_data/collections', exist_ok=True)
    os.makedirs('crawler_data/pages', exist_ok=True)
    os.makedirs('crawler_data/policies', exist_ok=True)
    os.makedirs('crawler_data/blogs', exist_ok=True)

    # 1. Fetch Collections
    print("Fetching collections.json...")
    try:
        colls_data = fetch_json('https://ptccollectibles.com/collections.json?limit=250')
        collections = colls_data.get('collections', [])
        print(f"Retrieved {len(collections)} collections from collections.json")
        with open('crawler_data/collections/collections.json', 'w', encoding='utf-8') as f:
            json.dump(collections, f, indent=2)
    except Exception as e:
        print("Failed to fetch collections.json:", e)

    # 2. Fetch Products pages (sample or first few pages to understand product schema, plus catalog)
    print("Fetching products.json pages...")
    all_products = []
    page = 1
    # We will fetch first 3 pages (up to 750 products) to have deep realistic data and schemas
    while page <= 4:
        url = f'https://ptccollectibles.com/products.json?limit=250&page={page}'
        try:
            print(f"  Fetching products page {page}...")
            data = fetch_json(url)
            prods = data.get('products', [])
            if not prods:
                break
            all_products.extend(prods)
            print(f"    Page {page}: retrieved {len(prods)} products (total: {len(all_products)})")
            page += 1
            time.sleep(0.5)
        except Exception as e:
            print(f"    Error fetching products page {page}: {e}")
            break

    with open('crawler_data/products/products_sample.json', 'w', encoding='utf-8') as f:
        json.dump(all_products, f, indent=2)

    # 3. Fetch Pages
    pages_to_fetch = [
        'contact-us',
        'sell-your-cards',
        'ptc-collectibles-rewards',
        'affiliate',
        'collection-bundle',
        'data-sharing-opt-out'
    ]
    for p_slug in pages_to_fetch:
        url = f'https://ptccollectibles.com/pages/{p_slug}'
        try:
            print(f"Fetching page: {url}")
            html = fetch_html(url)
            with open(f'crawler_data/pages/{p_slug}.html', 'w', encoding='utf-8') as f:
                f.write(html)
        except Exception as e:
            print(f"  Error fetching {url}: {e}")

    # 4. Fetch Policies
    policies = ['refund-policy', 'shipping-policy', 'privacy-policy', 'terms-of-service', 'legal-notice']
    for pol in policies:
        url = f'https://ptccollectibles.com/policies/{pol}'
        try:
            print(f"Fetching policy: {url}")
            html = fetch_html(url)
            with open(f'crawler_data/policies/{pol}.html', 'w', encoding='utf-8') as f:
                f.write(html)
        except Exception as e:
            print(f"  Error fetching {url}: {e}")

    # 5. Fetch Articles
    articles = [
        'best-pokemon-mystery-boxes-are-they-worth-it',
        'how-to-spot-authentic-graded-pokemon-cards',
        'japanese-vs-english-pokemon-cards-whats-the-difference',
        'me05-pitch-black-pokemon-cards-everything-you-need-to-know',
        'where-to-buy-korean-pokemon-cards-in-canada'
    ]
    for art in articles:
        url = f'https://ptccollectibles.com/blogs/pokemon-card-news-support-ptc-collectibles/{art}'
        try:
            print(f"Fetching article: {url}")
            html = fetch_html(url)
            with open(f'crawler_data/blogs/{art}.html', 'w', encoding='utf-8') as f:
                f.write(html)
        except Exception as e:
            print(f"  Error fetching {url}: {e}")

    print("Completed initial store data fetch.")

if __name__ == '__main__':
    main()
