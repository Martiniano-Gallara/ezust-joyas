import os
from PIL import Image

# Positions of the jewelry pieces in each slide
# Slide 1: bust center is around (0.50, 0.45)
# Slide 2: butterfly earrings on velvet pad (0.45, 0.35)
# Slide 3: necklace charms on bust (0.50, 0.55)
# Slide 4: heart & boy pendants (0.53, 0.50)
# Slide 5: flower necklace pendant and flower earrings (0.55, 0.50) or earrings (0.48, 0.23) / pendant (0.60, 0.83)
# Slide 6: gem hoops on velvet (0.48, 0.32)

crops3 = {
    1: (0.52, 0.48),
    2: (0.45, 0.32),
    3: (0.50, 0.55),
    4: (0.53, 0.50),
    5: (0.48, 0.28), # focus on the floral earrings and necklace
    6: (0.48, 0.32),
}

os.makedirs('downloaded_post3/test_details', exist_ok=True)
for i, (cx_pct, cy_pct) in crops3.items():
    img = Image.open(f'downloaded_post3/post3_slide_{i}.jpg')
    w, h = img.size
    cx, cy = int(w * cx_pct), int(h * cy_pct)
    box_size = 1800
    left = max(0, min(w - box_size, cx - box_size // 2))
    top = max(0, min(h - box_size, cy - box_size // 2))
    right = left + box_size
    bottom = top + box_size
    cropped = img.crop((left, top, right, bottom)).resize((500, 500), Image.Resampling.LANCZOS)
    cropped.save(f'downloaded_post3/test_details/test_detail_{i}.jpg', quality=85)

print("Test details 3 saved.")
