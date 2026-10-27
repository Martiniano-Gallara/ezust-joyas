import urllib.request, re, json, html, os

url = 'https://www.instagram.com/p/DefGyT8GafI/embed/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})

try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode('utf-8', errors='ignore')
    
    # Check if there are matches directly or after replacing escaped quotes
    raw = content.replace(r'\"', '"')
    matches = re.findall(r'"display_url"\s*:\s*"([^"]+)"', raw)
    seen = set()
    unique_urls = []
    for m in matches:
        u = m.replace(r'\\/', '/').replace(r'\/', '/').replace(r'\u0025', '%').replace(r'\u0026', '&')
        if u not in seen:
            seen.add(u)
            unique_urls.append(u)

    print(f"Total unique display_urls: {len(unique_urls)}")
    for idx, u in enumerate(unique_urls):
        print(f"[{idx+1}] {u[:140]}")
    
    with open('post3_urls.json', 'w', encoding='utf-8') as f:
        json.dump(unique_urls, f, indent=2)

    # Also look for caption text
    caption_m = re.findall(r'"caption"\s*:\s*\{"text"\s*:\s*"([^"]+)"', raw)
    if caption_m:
        print("Caption:", caption_m[0].encode('utf-8').decode('unicode_escape'))
    else:
        text_m = re.findall(r'"text"\s*:\s*"([^"]{15,})"', raw)
        for t in text_m[:5]:
            print("Text:", t.encode('utf-8').decode('unicode_escape')[:120])
except Exception as e:
    print("Error:", e)
