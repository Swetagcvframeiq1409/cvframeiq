#!/usr/bin/env python3
import argparse
import os
from pathlib import Path

from PIL import Image

MAPPING = {
    "1000850665": "security-surveillance-helps",
    "1000850666": "manufacturing-hero",
    "1000850667": "smart-city-helps",
    "1000850668": "smart-city-hero",
    "1000850669": "security-surveillance-hero",
    "1000850670": "retail-hero",
    "1000850671": "manufacturing-helps",
    "1000850672": "hub-tile-quality-control",
    "1000850673": "hub-tile-vehicle-safety",
    "1000850674": "hub-tile-hazard-detection",
    "1000850675": "spare-safety-ppe-a",
    "1000850676": "spare-pcb-guardian",
    "1000850677": "spare-vehicle-safety-b",
    "1000850678": "spare-hazard-b",
    "1000850679": "hub-tile-safety-ppe",
    "1000850680": "events-entertainment-hero",
    "1000850681": "hub-tile-venue-operations",
    "1000850656": "hub-hero",
    "1000850657": "home-team",
    "1000850658": "retail-helps",
    "1000850664": "manufacturing-defect-inspection",
    "1000850663": "ai-agents-control-room",
    "1000850662": "manufacturing-predictive-maintenance",
    "1000850661": "manufacturing-line-monitoring",
    "1000850660": "ai-analytics-operator",
    "1000850659": "infrastructure-pump-station",
}
VARIANTS = [
    (1456, 82),
    (480, 80),
    (800, 80),
    (1200, 80),
]
TARGET_EXTENSIONS = (".png", ".jpg", ".jpeg", ".webp")


def find_source(incoming_dir: Path, original_name: str) -> Path | None:
    candidates = [
        incoming_dir / f"{original_name}{ext}"
        for ext in TARGET_EXTENSIONS
    ]
    for candidate in candidates:
        if candidate.exists():
            return candidate
    return None


def save_variant(image: Image.Image, output_path: Path, quality: int, target_width: int) -> int:
    width, height = image.size
    aspect = height / width
    new_height = max(1, int(round(target_width * aspect)))
    resized = image.resize((target_width, new_height), Image.Resampling.LANCZOS)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    resized.save(output_path, format="WEBP", quality=quality, method=6, optimize=True)
    return output_path.stat().st_size


def ensure_under_limit(output_path: Path, image: Image.Image, base_quality: int, width: int) -> int:
    quality = base_quality
    while quality >= 45:
        temp_path = output_path.with_suffix(".tmp.webp")
        size = save_variant(image, temp_path, quality, width)
        if size <= 220 * 1024:
            temp_path.replace(output_path)
            return size
        quality -= 2
        temp_path.unlink(missing_ok=True)
    # final fallback at lowest quality; ensure file exists
    save_variant(image, output_path, 45, width)
    return output_path.stat().st_size


def process_one(original_name: str, output_name: str, incoming_dir: Path, output_dir: Path):
    source = find_source(incoming_dir, original_name)
    if source is None:
        return {
            "original": original_name,
            "new_name": output_name,
            "found": False,
            "sizes": {},
            "total_bytes": 0,
        }

    with Image.open(source) as pil_image:
        rgb_image = pil_image.convert("RGB")
        sizes = {}
        total_bytes = 0

        for width, quality in VARIANTS:
            target = output_dir / f"{output_name}{('-' + str(width)) if width != 1456 else ''}.webp"
            if width == 1456:
                byte_count = ensure_under_limit(target, rgb_image, quality, width)
            else:
                byte_count = ensure_under_limit(target, rgb_image, quality, width)
            sizes[str(width)] = byte_count
            total_bytes += byte_count

    return {
        "original": original_name,
        "new_name": output_name,
        "found": True,
        "sizes": sizes,
        "total_bytes": total_bytes,
    }


def parse_args():
    parser = argparse.ArgumentParser(description="Prepare sector images for the FrameIQ static site.")
    parser.add_argument("--incoming", type=Path, default=Path("assets/img/_incoming"), help="Folder containing original source images.")
    parser.add_argument("--output", type=Path, default=Path("assets/img/sectors"), help="Folder to write optimized WebP variants.")
    return parser.parse_args()


def main():
    args = parse_args()
    repo_root = Path(__file__).resolve().parents[1]
    incoming_dir = (repo_root / args.incoming).resolve()
    output_dir = (repo_root / args.output).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    rows = []
    for original_name, output_name in sorted(MAPPING.items(), key=lambda item: item[1]):
        result = process_one(original_name, output_name, incoming_dir, output_dir)
        rows.append(result)

    print(f"{'original':<20} {'new_name':<30} {'found':<6} {'1456 KB':>10} {'480 KB':>10} {'800 KB':>10} {'1200 KB':>10} {'total KB':>10}")
    for row in rows:
        sizes = row["sizes"]
        found = "yes" if row["found"] else "no"
        values = [
            row["original"],
            row["new_name"],
            found,
            f"{sizes.get('1456', 0) / 1024:.2f}",
            f"{sizes.get('480', 0) / 1024:.2f}",
            f"{sizes.get('800', 0) / 1024:.2f}",
            f"{sizes.get('1200', 0) / 1024:.2f}",
            f"{row['total_bytes'] / 1024:.2f}",
        ]
        print(f"{values[0]:<20} {values[1]:<30} {values[2]:<6} {values[3]:>10} {values[4]:>10} {values[5]:>10} {values[6]:>10} {values[7]:>10}")

    total_bytes = sum(row["total_bytes"] for row in rows)
    print(f"\nTotal bytes across all generated variants: {total_bytes} bytes")


if __name__ == "__main__":
    main()
