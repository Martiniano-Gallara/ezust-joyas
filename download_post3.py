import urllib.request
import json
import os

os.makedirs('downloaded_post3', exist_ok=True)

with open('post3_urls.json', 'r', encoding='utf-8') as f:
    urls = json.load(f)

for idx, url in enumerate(urls, 1):
    dest = f"downloaded_post3/post3_slide_{idx}.jpg"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        with urllib.request.urlopen(req) as resp, open(dest, 'wb') as out:
            out.write(resp.read())
        size = os.path.getsize(dest)
        print(f"Downloaded slide {idx} -> {dest} ({size} bytes)")
    except Exception as e:
        print(f"Error downloading slide {idx}: {e}")
