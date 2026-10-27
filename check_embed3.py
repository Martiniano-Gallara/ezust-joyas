import urllib.request
import re

url = 'https://www.instagram.com/p/DefGyT8GafI/embed/'
req = urllib.request.Request(url, headers={
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
})

html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
print(f"Length of embed html: {len(html)}")

# Check for any image urls or cdn urls
jpgs = re.findall(r'https://[^"\'\s]+\.jpg[^"\'\s]*', html)
print(f"Found {len(jpgs)} .jpg urls")
for j in jpgs[:5]:
    print("JPG:", j[:120])

# Check for shortcode or script contents
with open("scratch_embed_post3.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Saved scratch_embed_post3.html")
