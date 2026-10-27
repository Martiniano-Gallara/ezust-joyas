import urllib.request

for shortcode in ['Dez_h98EfCF', 'Dd7h0-DkTim', 'DefGyT8GafI']:
    url = f'https://www.instagram.com/p/{shortcode}/embed/'
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        resp = urllib.request.urlopen(req)
        content = resp.read().decode('utf-8', errors='ignore')
        print(f"Code {shortcode}: len={len(content)}, scontent={content.count('scontent')}, display_url={content.count('display_url')}")
    except Exception as e:
        print(f"Code {shortcode}: Error {e}")
