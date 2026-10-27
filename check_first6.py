from PIL import Image

for i in range(1, 7):
    f = f"assets/products_hq/ez-real-{i:02d}_main.jpg"
    img = Image.open(f)
    print(f"ez-real-{i:02d}: {img.size}")
