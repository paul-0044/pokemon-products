"""
Master Crawl Script for ptccollectibles.com
Crawls everything: site meta, homepage structure, navigation, all pages,
collections, products, policies, blogs, images and assets.
"""

import json
import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

BASE_URL = "https://ptccollectibles.com"
DATA_DIR = "crawler_data"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

def fetch(url, retries=3, delay=1.5):
    for attempt in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=30)
            r.raise_for_status()
            return r
        except Exception as e:
            print(f"  [WARN] Attempt {attempt+1} failed for {url}: {e}")
            time.sleep(delay * (attempt + 1))
    return None

def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"  [SAVED] {path}")

def save_html(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"  [SAVED] {path}")

# ─── 1. SITE META & HOMEPAGE ─────────────────────────────────────────────────
def crawl_site_meta():
    print("\n=== 1. SITE META & HOMEPAGE ===")
    r = fetch(BASE_URL)
    if not r:
        print("[ERROR] Could not fetch homepage")
        return

    soup = BeautifulSoup(r.text, "html.parser")

    meta = {
        "url": BASE_URL,
        "title": soup.title.string.strip() if soup.title else "",
        "meta_description": "",
        "meta_keywords": "",
        "og": {},
        "twitter": {},
        "canonical": "",
        "favicon": "",
        "theme_color": "",
        "fonts": [],
        "css_files": [],
        "js_files": [],
        "shopify_theme": {},
    }

    for tag in soup.find_all("meta"):
        name = tag.get("name", tag.get("property", ""))
        content = tag.get("content", "")
        if name == "description":
            meta["meta_description"] = content
        elif name == "keywords":
            meta["meta_keywords"] = content
        elif name == "theme-color":
            meta["theme_color"] = content
        elif name.startswith("og:"):
            meta["og"][name] = content
        elif name.startswith("twitter:"):
            meta["twitter"][name] = content

    canonical = soup.find("link", rel="canonical")
    if canonical:
        meta["canonical"] = canonical.get("href", "")

    favicon = soup.find("link", rel=lambda r: r and "icon" in r)
    if favicon:
        meta["favicon"] = favicon.get("href", "")

    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href", "")
        if href:
            meta["css_files"].append(href)

    for script in soup.find_all("script", src=True):
        src = script.get("src", "")
        if src:
            meta["js_files"].append(src)

    # Google Fonts
    for link in soup.find_all("link", href=True):
        if "fonts.google" in link.get("href", "") or "fonts.gstatic" in link.get("href", ""):
            meta["fonts"].append(link.get("href"))

    # Shopify theme info from JS
    for script in soup.find_all("script"):
        text = script.string or ""
        if "Shopify.theme" in text:
            match = re.search(r'Shopify\.theme\s*=\s*({.*?});', text, re.DOTALL)
            if match:
                try:
                    meta["shopify_theme"] = json.loads(match.group(1))
                except:
                    meta["shopify_theme"] = {"raw": match.group(1)[:500]}

    save_json(f"{DATA_DIR}/site_meta.json", meta)

    # Save raw homepage HTML
    save_html(f"{DATA_DIR}/homepage.html", r.text)

    # Parse homepage sections
    parse_homepage_sections(soup)

# ─── 2. HOMEPAGE SECTIONS ─────────────────────────────────────────────────────
def parse_homepage_sections(soup):
    print("\n=== 2. HOMEPAGE SECTIONS ===")
    sections = []

    # Announcement bar
    announce = soup.find(class_=re.compile(r'announcement'))
    if announce:
        sections.append({
            "type": "announcement_bar",
            "text": announce.get_text(strip=True),
            "html_classes": announce.get("class", []),
        })

    # Header
    header = soup.find("header") or soup.find(id=re.compile(r'header'))
    if header:
        nav_links = []
        for a in header.find_all("a", href=True):
            text = a.get_text(strip=True)
            href = a.get("href", "")
            if text and href:
                nav_links.append({"text": text, "href": href})
        sections.append({
            "type": "header",
            "nav_links": nav_links,
            "html_classes": header.get("class", []),
        })

    # Main content sections
    main = soup.find("main") or soup.find(id="main-content") or soup.find(id="MainContent")
    if main:
        for i, section in enumerate(main.find_all(["section", "div"], recursive=False)):
            cls = " ".join(section.get("class", []))
            if not cls:
                continue
            section_data = {
                "index": i,
                "type": "section",
                "classes": cls,
                "id": section.get("id", ""),
                "text_preview": section.get_text(strip=True)[:300],
                "images": [],
                "links": [],
                "buttons": [],
            }
            for img in section.find_all("img"):
                section_data["images"].append({
                    "src": img.get("src", ""),
                    "srcset": img.get("srcset", ""),
                    "alt": img.get("alt", ""),
                    "width": img.get("width", ""),
                    "height": img.get("height", ""),
                    "loading": img.get("loading", ""),
                })
            for a in section.find_all("a", href=True):
                section_data["links"].append({
                    "text": a.get_text(strip=True),
                    "href": a.get("href", ""),
                })
            for btn in section.find_all(["button", "a"], class_=re.compile(r'btn|button')):
                section_data["buttons"].append({
                    "text": btn.get_text(strip=True),
                    "href": btn.get("href", ""),
                    "classes": " ".join(btn.get("class", [])),
                })
            sections.append(section_data)

    # Footer
    footer = soup.find("footer")
    if footer:
        footer_data = {
            "type": "footer",
            "text": footer.get_text(separator=" ", strip=True)[:1000],
            "links": [],
            "social": [],
        }
        for a in footer.find_all("a", href=True):
            text = a.get_text(strip=True)
            href = a.get("href", "")
            if "facebook" in href or "instagram" in href or "twitter" in href or "youtube" in href or "tiktok" in href:
                footer_data["social"].append({"platform": href, "text": text})
            elif text:
                footer_data["links"].append({"text": text, "href": href})
        sections.append(footer_data)

    save_json(f"{DATA_DIR}/homepage_sections.json", sections)
    print(f"  Parsed {len(sections)} homepage sections")

# ─── 3. NAVIGATION ────────────────────────────────────────────────────────────
def crawl_navigation():
    print("\n=== 3. NAVIGATION (JSON API) ===")
    # Shopify exposes navigation via /api/2023-10/menus
    # Try fetching nav from the rendered HTML
    r = fetch(BASE_URL)
    if not r:
        return

    soup = BeautifulSoup(r.text, "html.parser")
    nav = {"main_menu": [], "footer_menu": [], "header_dropdowns": []}

    header = soup.find("header")
    if header:
        # Top-level nav items
        nav_el = header.find("nav") or header.find(class_=re.compile(r'nav|menu'))
        if nav_el:
            for item in nav_el.find_all("li"):
                a = item.find("a", href=True)
                if not a:
                    continue
                entry = {
                    "label": a.get_text(strip=True),
                    "url": a.get("href", ""),
                    "children": []
                }
                # Check for dropdown
                dropdown = item.find(class_=re.compile(r'dropdown|submenu|mega'))
                if dropdown:
                    for sub_a in dropdown.find_all("a", href=True):
                        entry["children"].append({
                            "label": sub_a.get_text(strip=True),
                            "url": sub_a.get("href", "")
                        })
                if entry["label"]:
                    nav["main_menu"].append(entry)

    footer = soup.find("footer")
    if footer:
        for a in footer.find_all("a", href=True):
            text = a.get_text(strip=True)
            if text:
                nav["footer_menu"].append({"label": text, "url": a.get("href", "")})

    save_json(f"{DATA_DIR}/navigation.json", nav)
    print(f"  Main menu: {len(nav['main_menu'])} items, Footer: {len(nav['footer_menu'])} items")

# ─── 4. ALL PAGES ─────────────────────────────────────────────────────────────
def crawl_all_pages():
    print("\n=== 4. ALL CUSTOM PAGES ===")
    page_urls = [
        "/pages/affiliate",
        "/pages/collection-bundle",
        "/pages/contact-us",
        "/pages/data-sharing-opt-out",
        "/pages/ptc-collectibles-rewards",
        "/pages/sell-your-cards",
    ]

    pages_data = []
    for path in page_urls:
        url = BASE_URL + path
        print(f"  Fetching: {url}")
        r = fetch(url)
        if not r:
            continue

        soup = BeautifulSoup(r.text, "html.parser")
        main = soup.find("main") or soup.find(id=re.compile(r'main'))

        page = {
            "url": url,
            "slug": path.split("/")[-1],
            "title": soup.title.string.strip() if soup.title else "",
            "meta_description": "",
            "h1": "",
            "sections": [],
            "images": [],
            "forms": [],
            "text_content": "",
        }

        desc = soup.find("meta", {"name": "description"})
        if desc:
            page["meta_description"] = desc.get("content", "")

        h1 = soup.find("h1")
        if h1:
            page["h1"] = h1.get_text(strip=True)

        if main:
            page["text_content"] = main.get_text(separator="\n", strip=True)[:3000]
            for img in main.find_all("img"):
                page["images"].append({
                    "src": img.get("src", ""),
                    "alt": img.get("alt", ""),
                    "srcset": img.get("srcset", ""),
                })
            for section in main.find_all(["section", "div"], class_=True):
                cls = " ".join(section.get("class", []))
                page["sections"].append({
                    "classes": cls,
                    "text": section.get_text(strip=True)[:300],
                })
            for form in main.find_all("form"):
                fields = []
                for inp in form.find_all(["input", "textarea", "select"]):
                    fields.append({
                        "tag": inp.name,
                        "type": inp.get("type", ""),
                        "name": inp.get("name", ""),
                        "placeholder": inp.get("placeholder", ""),
                        "required": inp.get("required") is not None,
                    })
                page["forms"].append({
                    "action": form.get("action", ""),
                    "method": form.get("method", ""),
                    "fields": fields,
                })

        pages_data.append(page)
        time.sleep(0.8)

    save_json(f"{DATA_DIR}/pages/all_pages.json", pages_data)
    print(f"  Crawled {len(pages_data)} custom pages")

# ─── 5. POLICIES ──────────────────────────────────────────────────────────────
def crawl_policies():
    print("\n=== 5. POLICIES ===")
    policy_urls = [
        "/policies/refund-policy",
        "/policies/privacy-policy",
        "/policies/terms-of-service",
        "/policies/shipping-policy",
        "/policies/legal-notice",
    ]

    policies = []
    for path in policy_urls:
        url = BASE_URL + path
        print(f"  Fetching: {url}")
        r = fetch(url)
        if not r:
            continue

        soup = BeautifulSoup(r.text, "html.parser")
        main = soup.find("main") or soup.find(class_=re.compile(r'policy|page'))

        policy = {
            "url": url,
            "slug": path.split("/")[-1],
            "title": soup.title.string.strip() if soup.title else "",
            "h1": "",
            "content_html": "",
            "content_text": "",
        }

        h1 = soup.find("h1")
        if h1:
            policy["h1"] = h1.get_text(strip=True)

        if main:
            policy["content_text"] = main.get_text(separator="\n", strip=True)[:5000]
            # Get main content block
            content_div = main.find(class_=re.compile(r'policy|page__content|rte'))
            if content_div:
                policy["content_html"] = str(content_div)[:10000]

        policies.append(policy)
        time.sleep(0.8)

    save_json(f"{DATA_DIR}/policies/all_policies.json", policies)
    print(f"  Crawled {len(policies)} policies")

# ─── 6. COLLECTIONS ───────────────────────────────────────────────────────────
def crawl_collections():
    print("\n=== 6. COLLECTIONS (JSON API) ===")
    r = fetch(f"{BASE_URL}/collections.json?limit=250")
    if not r:
        return

    data = r.json()
    collections = data.get("collections", [])
    print(f"  Found {len(collections)} collections via API")

    # Enrich with HTML page for each collection
    enriched = []
    for i, col in enumerate(collections):
        handle = col.get("handle", "")
        col_url = f"{BASE_URL}/collections/{handle}"
        print(f"  [{i+1}/{len(collections)}] {handle}")

        col_data = {
            "id": col.get("id"),
            "handle": handle,
            "title": col.get("title"),
            "description": col.get("body_html", ""),
            "image": col.get("image", {}),
            "published_at": col.get("published_at"),
            "url": col_url,
            "product_count": 0,
            "sort_by": "",
            "filters": [],
            "banner_image": "",
            "products_preview": [],
        }

        # Fetch HTML page for more details
        hr = fetch(col_url)
        if hr:
            hsoup = BeautifulSoup(hr.text, "html.parser")
            # Product count
            count_el = hsoup.find(class_=re.compile(r'count|product-count|results'))
            if count_el:
                m = re.search(r'\d+', count_el.get_text())
                if m:
                    col_data["product_count"] = int(m.group())
            # Banner image
            banner = hsoup.find(class_=re.compile(r'banner|hero|collection-hero'))
            if banner:
                img = banner.find("img")
                if img:
                    col_data["banner_image"] = img.get("src", img.get("data-src", ""))
            # First few product cards
            for card in hsoup.find_all(class_=re.compile(r'product-card|product-item|grid__item'))[:6]:
                a = card.find("a", href=True)
                img = card.find("img")
                price = card.find(class_=re.compile(r'price'))
                col_data["products_preview"].append({
                    "href": a.get("href", "") if a else "",
                    "title": a.get_text(strip=True) if a else "",
                    "image": img.get("src", img.get("data-src", "")) if img else "",
                    "price": price.get_text(strip=True) if price else "",
                })

        enriched.append(col_data)
        time.sleep(0.5)

    save_json(f"{DATA_DIR}/collections/collections_full.json", enriched)
    print(f"  Saved {len(enriched)} enriched collections")

# ─── 7. PRODUCTS (via API) ────────────────────────────────────────────────────
def crawl_products():
    print("\n=== 7. PRODUCTS (JSON API) ===")
    all_products = []
    page = 1
    limit = 250

    while True:
        url = f"{BASE_URL}/products.json?limit={limit}&page={page}"
        print(f"  Fetching page {page}...")
        r = fetch(url)
        if not r:
            break

        data = r.json()
        products = data.get("products", [])
        if not products:
            break

        all_products.extend(products)
        print(f"  Got {len(products)} products (total: {len(all_products)})")

        if len(products) < limit:
            break
        page += 1
        time.sleep(0.5)

    print(f"  Total products: {len(all_products)}")

    # Convert prices to USD (CAD -> USD at 0.74)
    CAD_TO_USD = 0.74
    for p in all_products:
        for v in p.get("variants", []):
            try:
                if v.get("price"):
                    cad = float(v["price"])
                    v["price_cad"] = v["price"]
                    v["price"] = f"{cad * CAD_TO_USD:.2f}"
                    v["price_usd"] = v["price"]
                if v.get("compare_at_price"):
                    cad = float(v["compare_at_price"])
                    v["compare_at_price_cad"] = v["compare_at_price"]
                    v["compare_at_price"] = f"{cad * CAD_TO_USD:.2f}"
                    v["compare_at_price_usd"] = v["compare_at_price"]
            except:
                pass

    save_json(f"{DATA_DIR}/products/all_products.json", all_products)

    # Build summary
    summary = {
        "total_products": len(all_products),
        "total_variants": sum(len(p.get("variants", [])) for p in all_products),
        "total_images": sum(len(p.get("images", [])) for p in all_products),
        "product_types": list(set(p.get("product_type", "") for p in all_products if p.get("product_type"))),
        "tags_sample": list(set(t for p in all_products for t in p.get("tags", [])))[:50],
        "vendors": list(set(p.get("vendor", "") for p in all_products if p.get("vendor"))),
        "option_names": list(set(
            o.get("name", "") for p in all_products for o in p.get("options", [])
        )),
        "handle_list": [p.get("handle") for p in all_products],
    }
    save_json(f"{DATA_DIR}/products/products_summary.json", summary)
    print(f"  {summary['total_products']} products, {summary['total_variants']} variants, {summary['total_images']} images")
    return all_products

# ─── 8. BLOG / ARTICLES ───────────────────────────────────────────────────────
def crawl_blogs():
    print("\n=== 8. BLOGS & ARTICLES ===")
    r = fetch(f"{BASE_URL}/blogs.json")
    if not r:
        return

    data = r.json()
    blogs = data.get("blogs", [])
    print(f"  Found {len(blogs)} blogs")

    all_blog_data = []
    for blog in blogs:
        blog_handle = blog.get("handle")
        blog_entry = {
            "id": blog.get("id"),
            "handle": blog_handle,
            "title": blog.get("title"),
            "articles": []
        }

        # Get articles
        art_r = fetch(f"{BASE_URL}/blogs/{blog_handle}/articles.json?limit=250")
        if art_r:
            art_data = art_r.json()
            articles = art_data.get("articles", [])
            print(f"    Blog '{blog_handle}': {len(articles)} articles")
            for article in articles:
                blog_entry["articles"].append({
                    "id": article.get("id"),
                    "title": article.get("title"),
                    "handle": article.get("handle"),
                    "author": article.get("author"),
                    "published_at": article.get("published_at"),
                    "summary_html": article.get("summary_html", ""),
                    "image": article.get("image", {}),
                    "tags": article.get("tags", []),
                })

        all_blog_data.append(blog_entry)
        time.sleep(0.5)

    save_json(f"{DATA_DIR}/blogs/all_blogs.json", all_blog_data)
    print(f"  Saved blog data for {len(all_blog_data)} blogs")

# ─── 9. ASSET & IMAGE MANIFEST ────────────────────────────────────────────────
def crawl_asset_manifest():
    print("\n=== 9. ASSET & IMAGE MANIFEST ===")
    r = fetch(BASE_URL)
    if not r:
        return

    soup = BeautifulSoup(r.text, "html.parser")
    manifest = {
        "images": [],
        "css": [],
        "js": [],
        "fonts": [],
        "cdn_base": "",
    }

    # All images from homepage
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src") or img.get("data-srcset", "").split(",")[0].split(" ")[0]
        if src:
            manifest["images"].append({
                "src": src,
                "alt": img.get("alt", ""),
                "width": img.get("width", ""),
                "height": img.get("height", ""),
            })

    # CSS and JS
    for link in soup.find_all("link", rel="stylesheet"):
        href = link.get("href", "")
        if href:
            manifest["css"].append(href)
            if "cdn.shopify.com" in href and not manifest["cdn_base"]:
                manifest["cdn_base"] = "/".join(href.split("/")[:5])

    for script in soup.find_all("script", src=True):
        src = script.get("src", "")
        if src:
            manifest["js"].append(src)

    # Fonts
    for link in soup.find_all("link", href=True):
        href = link.get("href", "")
        if "font" in href.lower() or "google" in href.lower():
            manifest["fonts"].append(href)

    save_json(f"{DATA_DIR}/asset_manifest.json", manifest)
    print(f"  {len(manifest['images'])} images, {len(manifest['css'])} CSS, {len(manifest['js'])} JS files")

# ─── 10. DESIGN TOKENS (CSS variables, colors, fonts) ────────────────────────
def crawl_design_tokens():
    print("\n=== 10. DESIGN TOKENS (CSS Variables) ===")
    r = fetch(BASE_URL)
    if not r:
        return

    soup = BeautifulSoup(r.text, "html.parser")
    tokens = {
        "css_variables": {},
        "colors": [],
        "fonts": [],
        "inline_styles": [],
    }

    # Look for <style> blocks with CSS variables
    for style in soup.find_all("style"):
        text = style.string or ""
        # Extract :root variables
        root_match = re.search(r':root\s*\{([^}]+)\}', text, re.DOTALL)
        if root_match:
            for line in root_match.group(1).split(";"):
                line = line.strip()
                if line.startswith("--"):
                    parts = line.split(":", 1)
                    if len(parts) == 2:
                        tokens["css_variables"][parts[0].strip()] = parts[1].strip()

        # Extract hex colors
        colors = re.findall(r'#[0-9a-fA-F]{3,8}', text)
        tokens["colors"].extend(colors)

        # Font-family
        fonts = re.findall(r'font-family:\s*([^;]+);', text)
        tokens["fonts"].extend(fonts)

    tokens["colors"] = list(set(tokens["colors"]))
    tokens["fonts"] = list(set(tokens["fonts"]))

    save_json(f"{DATA_DIR}/design_tokens.json", tokens)
    print(f"  CSS vars: {len(tokens['css_variables'])}, colors: {len(tokens['colors'])}, fonts: {len(tokens['fonts'])}")

# ─── 11. SITEMAP ──────────────────────────────────────────────────────────────
def crawl_sitemap():
    print("\n=== 11. SITEMAP ===")
    r = fetch(f"{BASE_URL}/sitemap.xml")
    if not r:
        return

    save_html(f"{DATA_DIR}/sitemap.xml", r.text)

    # Parse all sitemaps
    soup = BeautifulSoup(r.text, "xml")
    all_urls = []

    # Sub-sitemaps
    for loc in soup.find_all("loc"):
        sub_url = loc.text.strip()
        if sub_url.endswith(".xml"):
            print(f"  Sub-sitemap: {sub_url}")
            sub_r = fetch(sub_url)
            if sub_r:
                sub_soup = BeautifulSoup(sub_r.text, "xml")
                for url_tag in sub_soup.find_all("url"):
                    loc_tag = url_tag.find("loc")
                    lastmod_tag = url_tag.find("lastmod")
                    if loc_tag:
                        all_urls.append({
                            "url": loc_tag.text.strip(),
                            "lastmod": lastmod_tag.text.strip() if lastmod_tag else "",
                            "source": sub_url,
                        })
                time.sleep(0.3)

    save_json(f"{DATA_DIR}/sitemap_urls.json", all_urls)
    print(f"  Total URLs in sitemap: {len(all_urls)}")

# ─── MAIN ─────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("=" * 60)
    print("MASTER CRAWL - ptccollectibles.com")
    print("=" * 60)

    os.makedirs(DATA_DIR, exist_ok=True)
    os.makedirs(f"{DATA_DIR}/products", exist_ok=True)
    os.makedirs(f"{DATA_DIR}/collections", exist_ok=True)
    os.makedirs(f"{DATA_DIR}/pages", exist_ok=True)
    os.makedirs(f"{DATA_DIR}/policies", exist_ok=True)
    os.makedirs(f"{DATA_DIR}/blogs", exist_ok=True)

    crawl_sitemap()
    crawl_site_meta()
    crawl_navigation()
    crawl_all_pages()
    crawl_policies()
    crawl_collections()
    products = crawl_products()
    crawl_blogs()
    crawl_asset_manifest()
    crawl_design_tokens()

    print("\n" + "=" * 60)
    print("MASTER CRAWL COMPLETE")
    print("=" * 60)
    print(f"\nData saved to: {os.path.abspath(DATA_DIR)}")
