import os
from PIL import Image

for f in sorted(os.listdir('assets/img')):
    path = os.path.join('assets/img', f)
    if os.path.isfile(path):
        img = Image.open(path)
        print(f"{f}: {img.size}")
