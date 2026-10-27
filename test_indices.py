import urllib.request, re

for idx in range(1, 10):
    url = f'https://www.instagram.com/p/Dez_h98EfCF/?img_index={idx}'
    req = urllib.request.Request(url, headers={'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'})
    try:
        with urllib.request.urlopen(req) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
            og_imgs = re.findall(r'<meta property="og:image" content="([^"]+)"', html)
            print(f'img_index={idx}: {len(og_imgs)} found')
            if og_imgs:
                print(' ', og_imgs[0][:140])
    except Exception as e:
        print(f'img_index={idx}: Error {e}')
