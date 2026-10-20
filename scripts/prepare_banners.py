import os
import urllib.request
import io
from PIL import Image

os.makedirs('public/images/banners', exist_ok=True)
os.makedirs('dist/images/banners', exist_ok=True)

# 1. Delta Reign (Slide 3)
url3 = 'https://ptccollectibles.com/cdn/shop/files/Delta_Reign_Pokemon_Banner_1.jpg?v=1792002542&width=2500'
try:
    req = urllib.request.Request(url3, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=15) as r:
        img3 = Image.open(io.BytesIO(r.read()))
        img3.save('public/images/banners/hero_banner_3.webp', 'WEBP', quality=92)
        img3.save('dist/images/banners/hero_banner_3.webp', 'WEBP', quality=92)
        print("Hero banner 3 saved:", img3.size)
except Exception as e:
    print("Error downloading banner 3:", e)

