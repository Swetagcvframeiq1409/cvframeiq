"""
prepare-sector-images-by-name.py
Generates responsive variants for canonical sector image names.
Safe to run twice: skips files that already exist and are non-zero.
Reads sources from assets/img/, writes to assets/img/sectors/.
"""
import os
import sys

try:
    from PIL import Image
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False
    print("Pillow not found. Run: pip install pillow")
    sys.exit(1)

SITE_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR   = os.path.join(SITE_ROOT, 'assets', 'img')
DST_DIR   = os.path.join(SITE_ROOT, 'assets', 'img', 'sectors')
os.makedirs(DST_DIR, exist_ok=True)

MAX_FULL  = 1456
SIZES     = [480, 800, 1200]
Q_FULL    = 82
Q_VARIANT = 80
MAX_KB    = 220

# Canonical name -> source filename in SRC_DIR
# Only entries that are NOT already in DST_DIR with all variants
SOURCES = {
    'smart-city-hero': 'ismart-city-hero.webp',
}

def write_webp(im, path, quality, label):
    if os.path.exists(path) and os.path.getsize(path) > 0:
        kb = os.path.getsize(path) / 1024
        print(f"  SKIP (exists) {label:<45} {kb:>7.1f} KB")
        return kb
    im.save(path, 'WEBP', quality=quality, method=6)
    kb = os.path.getsize(path) / 1024
    flag = ' WARN>220KB' if kb > MAX_KB else ''
    print(f"  WROTE        {label:<45} {kb:>7.1f} KB{flag}")
    return kb

print(f"\n{'Name':<35} {'Source':<35} {'Sizes written'}")
print('-' * 90)

for canonical, src_name in SOURCES.items():
    src_path = os.path.join(SRC_DIR, src_name)
    if not os.path.exists(src_path):
        print(f"{canonical:<35} MISSING: {src_name}")
        continue

    with Image.open(src_path) as im:
        orig_w, orig_h = im.size
        rgb = im.convert('RGB')

    print(f"\n{canonical} <- {src_name} ({orig_w}x{orig_h})")
    written = []

    # Full size (capped at MAX_FULL wide)
    if orig_w > MAX_FULL:
        ratio = MAX_FULL / orig_w
        new_h = round(orig_h * ratio)
        full_im = rgb.resize((MAX_FULL, new_h), Image.LANCZOS)
    else:
        full_im = rgb
    dst = os.path.join(DST_DIR, f'{canonical}.webp')
    kb = write_webp(full_im, dst, Q_FULL, f'{canonical}.webp')
    written.append(f'full({full_im.size[0]}px,{kb:.0f}KB)')

    # Responsive variants
    for w in SIZES:
        if w >= orig_w:
            print(f"  SKIP (source {orig_w}px <= {w}px) {canonical}-{w}.webp")
            continue
        ratio = w / orig_w
        new_h = round(orig_h * ratio)
        resized = rgb.resize((w, new_h), Image.LANCZOS)
        dst = os.path.join(DST_DIR, f'{canonical}-{w}.webp')
        kb = write_webp(resized, dst, Q_VARIANT, f'{canonical}-{w}.webp')
        written.append(f'{w}px({kb:.0f}KB)')

    print(f"  -> {', '.join(written)}")

print('\n=== Done ===')
print('Verify: assets/img/sectors/smart-city-hero*.webp should now exist.')
