import urllib.request
import re
import json

ua = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
req = urllib.request.Request('https://www.instagram.com/p/Dez_h98EfCF/', headers={'User-Agent': ua})
with urllib.request.urlopen(req) as resp:
    html = resp.read().decode('utf-8', errors='ignore')

with open('scratch_fb.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("Saved scratch_fb.html, len:", len(html))

# Search for all script tags or json
scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print("Found scripts:", len(scripts))
for i, s in enumerate(scripts):
    if 'scontent' in s or 'CAROUSEL' in s or 'Dez_h98EfCF' in s:
        print(f"Script {i} matches! Len: {len(s)}")
        with open(f'scratch_script_{i}.txt', 'w', encoding='utf-8') as sf:
            sf.write(s)
