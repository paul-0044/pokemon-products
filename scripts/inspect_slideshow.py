import sys
from bs4 import BeautifulSoup

sys.stdout.reconfigure(encoding='utf-8')

with open('crawler_data/homepage.html', 'r', encoding='utf-8', errors='ignore') as f:
    soup = BeautifulSoup(f.read(), 'html.parser')

slideshow = soup.find(id=lambda x: x and 'template--21955028287649__1659586674dc0b8e4b' in x)
if not slideshow:
    # search by class
    slideshow = soup.find('slideshow-component')

print("Found slideshow element:", bool(slideshow))
if slideshow:
    for item in slideshow.find_all(class_=lambda c: c and 'slideshow__slide' in c):
        print("\n--- SLIDE ---")
        for img in item.find_all('img'):
            print("IMG src:", img.get('src'))
            print("IMG alt:", img.get('alt'))
            print("IMG srcset:", img.get('srcset')[:100] if img.get('srcset') else None)
        for link in item.find_all('a'):
            print("LINK:", link.get('href'), link.get_text(strip=True))
        for h in item.find_all(['h1', 'h2', 'h3', 'p']):
            print("TEXT:", h.name, h.get_text(strip=True))
