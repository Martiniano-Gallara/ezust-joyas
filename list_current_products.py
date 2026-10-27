import re

with open('js/app.js', 'r', encoding='utf-8') as f:
    text = f.read()

products = re.findall(r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)"', text)
print(f"Total products in app.js: {len(products)}")
for idx, (pid, name, cat) in enumerate(products, 1):
    print(f"{idx}. [{pid}] ({cat}) {name}")
