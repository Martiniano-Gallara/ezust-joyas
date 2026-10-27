import re
import json

with open('scratch_embed_post3.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for "display_url" or "image_versions2" or "candidates" or any cdninstagram URL
# Unescape backslashes first
unescaped = text.replace('\\/', '/')

urls = re.findall(r'https://[^"\'\s<>]+cdninstagram\.com/[^"\'\s<>]+', unescaped)
print(f"Found {len(urls)} raw cdninstagram URLs")

# Filter unique clean URLs
clean_urls = []
for u in urls:
    # unescape unicode if any
    try:
        cu = u.encode('utf-8').decode('unicode_escape')
    except:
        cu = u
    # Remove trailing quotes or backslashes
    cu = cu.split('"')[0].split('\\')[0].split('&quot;')[0]
    if cu not in clean_urls and ('.jpg' in cu or '.webp' in cu or 'stp=' in cu):
        clean_urls.append(cu)

print(f"Found {len(clean_urls)} candidate image URLs")
for i, u in enumerate(clean_urls[:10]):
    print(f"[{i}]: {u[:120]}")

# Let's find post caption / text
captions = re.findall(r'"caption":\{"text":"([^"]+)"', text)
if captions:
    print("Caption:", captions[0].encode('utf-8').decode('unicode_escape'))
else:
    # try other caption patterns
    captions2 = re.findall(r'"text":\s*"([^"]{20,})"', text)
    for c in captions2[:5]:
        print("Text snippet:", c.encode('utf-8').decode('unicode_escape')[:150])
