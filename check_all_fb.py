with open('scratch_fb.html', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# find all links or text with cdninstagram or scontent
matches = re.findall(r'https:[^"\'\s<>\\]*(?:cdninstagram|fbcdn)[^"\'\s<>\\]*', text)
print(f"Total CDN matches in full HTML: {len(matches)}")
cleaned = set()
for m in matches:
    c = m.replace(r'\/', '/').replace(r'\u0026', '&').replace('&amp;', '&')
    cleaned.add(c)

for idx, c in enumerate(cleaned):
    print(f"[{idx}] {c[:160]}")
