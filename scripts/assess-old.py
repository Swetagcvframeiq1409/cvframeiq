from PIL import Image
import os, statistics

img_dir = 'assets/img'
targets = [
    'aviation.webp',
    'healthcare.webp',
    'Agriculture.webp',
    'smartagriculture.webp',
    'agricultureai.webp',
    'securitysurveillance.webp',
    'smart-cities.webp',
]
print(f"{'File':<35} {'W':>5} {'H':>5} {'AvgR':>6} {'AvgG':>6} {'AvgB':>6} {'Dark?':>6} {'Violet?':>7}")
print('-'*80)
for fname in targets:
    p = os.path.join(img_dir, fname)
    with Image.open(p) as im:
        rgb = im.convert('RGB').resize((80, 60))
        pixels = list(rgb.getdata())
        r = statistics.mean(px[0] for px in pixels)
        g = statistics.mean(px[1] for px in pixels)
        b = statistics.mean(px[2] for px in pixels)
        lum = (r + g + b) / 3
        dark = 'yes' if lum < 100 else 'no'
        violet = 'yes' if b > r and b > g and r > 60 else 'no'
        w, h = im.size
    print(f"{fname:<35} {w:>5} {h:>5} {r:>6.0f} {g:>6.0f} {b:>6.0f} {dark:>6} {violet:>7}")
