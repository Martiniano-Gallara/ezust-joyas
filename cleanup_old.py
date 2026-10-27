import os
import shutil

dirs_to_remove = [
    'assets/raw_ezust',
    'assets/crops',
    'assets/cleaned',
    'assets/thumbs',
    'assets/images',
    'downloaded_post3'
]

for d in dirs_to_remove:
    if os.path.exists(d):
        shutil.rmtree(d)
        print(f"Removed directory: {d}")

files_to_remove = [
    'get_post3.py',
    'download_post3.py',
    'post3_urls.json',
    'process_post3_products.py',
    'check_embed3.py',
    'check_scontent.py',
    'test_embed3.py',
    'compare_codes.py',
    'check_first6.py',
    'list_current_products.py',
    'check_assets_img.py',
    'test_details3.py',
    'scratch_embed_post3.html',
    'make_previews3.py'
]

for f in files_to_remove:
    if os.path.exists(f):
        os.remove(f)
        print(f"Removed file: {f}")

print("Cleanup complete!")
