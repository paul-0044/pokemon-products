import sys
import re
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

with open('crawler_data/homepage.html', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

slides = soup.find_all(class_=re.compile(r'slideshow__slide', re.I))
print(f"Total slides found: {len(slides)}")

for idx, slide in enumerate(slides):
    print(f"\n--- SLIDE {idx + 1} ---")
    imgs = slide.find_all('img')
    for img in imgs:
        print("  Img src:", img.get('src') or img.get('data-src'))
        if img.get('srcset'):
            print("  Srcset sample:", img.get('srcset')[:150])
    headings = slide.find_all(['h1', 'h2', 'h3', 'p', 'a', 'span'])
    for h in headings:
        txt = h.get_text(strip=True)
        if txt and len(txt) > 2:
            print(f"  [{h.name}] {txt} (href={h.get('href')})")
