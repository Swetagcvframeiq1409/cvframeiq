from PIL import Image
import os

img_dir = os.path.join(os.path.dirname(__file__), '..', 'assets', 'img')

targets = [
    'ismart-city-hero.webp',
    'aviation.webp',
    'healthcare.webp',
    'Agriculture.webp',
    'smartagriculture.webp',
    'agricultureai.webp',
    'securitysurveillance.webp',
    'smart-cities.webp',
]

print(f"{'File':<45} {'W':>6} {'H':>6} {'KB':>8}")
print('-' * 70)
for name in targets:
    path = os.path.join(img_dir, name)
    if not os.path.exists(path):
        print(f"{name:<45} {'MISSING':>6}")
        continue
    with Image.open(path) as im:
        w, h = im.size
        kb = os.path.getsize(path) / 1024
        print(f"{name:<45} {w:>6} {h:>6} {kb:>8.1f}")
