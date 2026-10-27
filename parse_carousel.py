import re
import json

with open('scratch_script_28.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all image URLs with dimensions or display_url
# Instagram GraphQL response usually has "display_url", "image_versions2", "carousel_media", etc.
img_urls = re.findall(r'https:[\\/]+scontent[^\s"\'<>\\]+', text)
cleaned = set()
for u in img_urls:
    clean = u.replace(r'\/', '/').replace(r'\u0026', '&').replace('&amp;', '&')
    cleaned.add(clean)

print(f"Total scontent URLs: {len(cleaned)}")

# Let's filter for the high resolution versions
# Often has 1080x1080 or dst-jpg or similar
high_res = []
for u in cleaned:
    # check if it is not an icon/avatar
    if 's150x150' not in u and 's320x320' not in u:
        high_res.append(u)

print(f"Filtered candidate URLs: {len(high_res)}")
for idx, u in enumerate(high_res):
    print(f"[{idx}] {u[:160]}")
