import os
from PIL import Image

showcase_dir = "public/showcase"
if os.path.exists(showcase_dir):
    files = [f for f in os.listdir(showcase_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
    for f in files:
        img_path = os.path.join(showcase_dir, f)
        try:
            with Image.open(img_path) as img:
                width, height = img.size
                print(f"{f}: {width}x{height}")
        except Exception as e:
            print(f"{f}: Error {e}")
else:
    print("Directory not found")
