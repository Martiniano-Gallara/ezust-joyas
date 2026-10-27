import re

with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

pos_chunk = re.search(r'id="sales-sub-pos".*?id="sales-sub-orders"', content, re.DOTALL)
if pos_chunk:
    ids = re.findall(r'id="([^"]+)"', pos_chunk.group(0))
    print("POS CHUNK IDS:", ids)
