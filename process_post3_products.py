import os
from PIL import Image

crops = {
    1: {"id": "ez-real-19", "crop": (0.52, 0.48)},
    2: {"id": "ez-real-20", "crop": (0.45, 0.32)},
    3: {"id": "ez-real-21", "crop": (0.50, 0.55)},
    4: {"id": "ez-real-22", "crop": (0.53, 0.50)},
    5: {"id": "ez-real-23", "crop": (0.48, 0.28)},
    6: {"id": "ez-real-24", "crop": (0.48, 0.32)},
}

os.makedirs("assets/products_hq", exist_ok=True)
os.makedirs("assets/products_hq/details", exist_ok=True)

for slide_num, data in crops.items():
    src_file = f"downloaded_post3/post3_slide_{slide_num}.jpg"
    img = Image.open(src_file)
    w, h = img.size
    
    # 1. Main image: 4:5 aspect ratio (1200x1500)
    target_h = int(w * 1.25)
    if target_h <= h:
        top_offset = (h - target_h) // 2
        cropped_main = img.crop((0, top_offset, w, top_offset + target_h))
    else:
        cropped_main = img
    main_resized = cropped_main.resize((1200, 1500), Image.Resampling.LANCZOS)
    main_path = f"assets/products_hq/{data['id']}_main.jpg"
    main_resized.save(main_path, quality=90, optimize=True)
    
    # 2. Detail image: square 1000x1000 macro zoom
    cx_pct, cy_pct = data["crop"]
    cx, cy = int(w * cx_pct), int(h * cy_pct)
    box_size = 1800
    left = max(0, min(w - box_size, cx - box_size // 2))
    top = max(0, min(h - box_size, cy - box_size // 2))
    right = left + box_size
    bottom = top + box_size
    detail_resized = img.crop((left, top, right, bottom)).resize((1000, 1000), Image.Resampling.LANCZOS)
    detail_path = f"assets/products_hq/details/{data['id']}_detail.jpg"
    detail_resized.save(detail_path, quality=90, optimize=True)
    
    print(f"Processed {data['id']}: main -> {main_path}, detail -> {detail_path}")

print("All 6 post 3 products processed successfully!")
