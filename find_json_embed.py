import json, re

with open('scratch_embed.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Look for embedded JSON blobs
matches = re.findall(r'<script type="application/json"[^>]*>(.*?)</script>', text)
print(f"JSON script blobs: {len(matches)}")
for idx, m in enumerate(matches):
    if 'shortcode' in m or 'carousel' in m.lower() or 'edge_sidecar_to_children' in m or 'Dez_h98EfCF' in m:
        print(f"Match in blob {idx}! Len: {len(m)}")
        with open(f'blob_{idx}.json', 'w', encoding='utf-8') as out:
            out.write(m)

# Also check for window.__additionalDataLoaded
add_data = re.findall(r'window\.__additionalDataLoaded\s*\(\s*[^,]+,\s*(.*?)\);', text)
print("additionalDataLoaded:", len(add_data))
