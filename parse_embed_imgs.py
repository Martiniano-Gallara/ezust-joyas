import re, html

with open('scratch_embed.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Look for image objects or json in embed
# Usually window.__additionalDataLoaded or gql data or embedded JSON
matches = re.findall(r'https:[^"\'\s<>\\]*\.jpg[^"\'\s<>\\]*', content)
distinct_photos = {}

for m in matches:
    clean = m.replace(r'\/', '/').replace(r'\u0026', '&').replace('&amp;', '&')
    clean = html.unescape(clean)
    # Extract file ID or base name: e.g. 862852666_...
    file_match = re.search(r'/(\d+_\d+_\d+_n\.jpg)', clean)
    if file_match:
        file_id = file_match.group(1)
        # We want the highest quality URL (e.g. without small crop or with largest dimensions)
        if file_id not in distinct_photos or ('s100x100' in distinct_photos[file_id] and 's100x100' not in clean):
            distinct_photos[file_id] = clean
        elif 'dst-jpg' in clean and 'c0.' not in clean:
            distinct_photos[file_id] = clean

print(f"Distinct photo IDs found: {len(distinct_photos)}")
for k, v in distinct_photos.items():
    print(k, "->", v[:140])
