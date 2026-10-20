from bs4 import BeautifulSoup
import re
import sys
import json

sys.stdout.reconfigure(encoding='utf-8')

with open('crawler_data/homepage.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f, 'html.parser')

header_section = soup.find(id=re.compile(r'header', re.I))
if not header_section:
    header_section = soup.find('header')

print("Header element tag:", header_section.name if header_section else "Not found")

links = []
if header_section:
    for a in header_section.find_all('a'):
        t = a.get_text(strip=True)
        h = a.get('href', '')
        if t and not h.startswith('#'):
            links.append({'text': t, 'href': h})

print(f"Header links found ({len(links)}):")
unique_links = []
seen = set()
for lk in links:
    k = (lk['text'], lk['href'])
    if k not in seen:
        seen.add(k)
        unique_links.append(lk)
        print(f"  {lk['text']} -> {lk['href']}")

with open('crawler_data/header_nav.json', 'w', encoding='utf-8') as f:
    json.dump(unique_links, f, indent=2)
