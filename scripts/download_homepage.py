import urllib.request

req = urllib.request.Request('https://ptccollectibles.com', headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

with open('crawler_data/homepage.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"Downloaded homepage.html ({len(html)} bytes)")
