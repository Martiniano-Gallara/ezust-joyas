import urllib.request
import re

variants = [
    'https://www.instagram.com/p/DefGyT8GafI/embed/captioned/',
    'https://www.instagram.com/p/DefGyT8GafI/embed/',
    'https://www.instagram.com/reel/DefGyT8GafI/embed/captioned/',
    'https://www.instagram.com/reel/DefGyT8GafI/embed/'
]

for url in variants:
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Referer': 'https://www.google.com/'
        })
        resp = urllib.request.urlopen(req)
        content = resp.read().decode('utf-8', errors='ignore')
        print(f"URL: {url} -> len: {len(content)}, scontent: {content.count('scontent')}, display_url: {content.count('display_url')}")
        if 'scontent' in content or 'display_url' in content:
            with open('success_embed.html', 'w', encoding='utf-8') as f:
                f.write(content)
            print("WROTE success_embed.html!")
            break
    except Exception as e:
        print(f"URL: {url} -> Error: {e}")
