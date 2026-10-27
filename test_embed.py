import urllib.request
import re

url = 'https://www.instagram.com/p/Dez_h98EfCF/embed/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        with open('scratch_embed.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print("Embed fetched, len:", len(html))
        # check for image URLs in embed
        imgs = set(re.findall(r'https:[^"\'\s<>\\]*(?:cdninstagram|fbcdn)[^"\'\s<>\\]*', html))
        print("Found CDN imgs in embed:", len(imgs))
        for i in imgs:
            print(i[:120])
except Exception as e:
    print("Error:", e)
