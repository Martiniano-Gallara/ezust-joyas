from PIL import Image
import os

os.makedirs('downloaded_post3/previews', exist_ok=True)
for i in range(1, 7):
    img = Image.open(f'downloaded_post3/post3_slide_{i}.jpg')
    preview = img.resize((600, 750), Image.Resampling.LANCZOS)
    preview.save(f'downloaded_post3/previews/preview_{i}.jpg', quality=85)
print('Previews generated for post 3')
