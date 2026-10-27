import re

with open('scratch_embed_post3.html', 'r', encoding='utf-8') as f:
    text = f.read()

scontent_matches = [m.start() for m in re.finditer(r'scontent', text)]
print(f"scontent count: {len(scontent_matches)}")

if len(scontent_matches) > 0:
    for idx in scontent_matches[:5]:
        start = max(0, idx - 100)
        end = min(len(text), idx + 200)
        print("Snippet:", text[start:end])
else:
    # Let's search what kind of page was returned
    title = re.findall(r'<title>(.*?)</title>', text)
    print("Page Title:", title)
    # Check if there is an iframe or login requirement
    if "Login" in text or "iniciar sesión" in text.lower():
        print("Login detected")
