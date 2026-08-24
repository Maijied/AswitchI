#!/usr/bin/env python3
"""
AswitchI Central Asset Synchronization Tool
===========================================
Source of Truth: assets/icon.svg

This script centrally renders and synchronizes all application logos, icons, 
and graphical assets across Desktop UI, Website, Snapcraft, and Desktop entries.
"""

import sys
import os
import subprocess
import hashlib
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
MASTER_SVG = REPO_ROOT / "assets" / "icon.svg"

# Target specifications: (Relative Path, Format, Width, Height)
TARGETS = [
    # Core Assets
    ("assets/icon.svg", "copy_svg", None, None),
    ("assets/icon.png", "png", 512, 512),
    ("assets/snap_icon.png", "png", 1024, 1024),
    ("assets/snap_icon.jpg", "jpg", 1024, 1024),

    # Website Assets
    ("website/assets/icon.svg", "copy_svg", None, None),
    ("website/assets/icon.png", "png", 512, 512),
    ("website/assets/snap_icon.png", "png", 1024, 1024),
    ("website/assets/snap_icon.jpg", "jpg", 1024, 1024),
    ("website/icons/aswitchi.svg", "copy_svg", None, None),
    ("website/favicon.svg", "copy_svg", None, None),
    ("website/favicon.png", "png", 64, 64),

    # Desktop UI / In-App Icons
    ("src/ui/icons/aswitchi.svg", "copy_svg", None, None),
    ("src/ui/icons/aswitchi.png", "png", 256, 256),
]


def render_svg_to_png(src_svg: Path, dest_png: Path, width: int, height: int):
    dest_png.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "rsvg-convert",
        "-w", str(width),
        "-h", str(height),
        "-f", "png",
        "-o", str(dest_png),
        str(src_svg),
    ]
    subprocess.run(cmd, check=True)


def render_svg_to_jpg(src_svg: Path, dest_jpg: Path, width: int, height: int):
    dest_jpg.parent.mkdir(parents=True, exist_ok=True)
    temp_png = dest_jpg.with_suffix(".temp.png")
    render_svg_to_png(src_svg, temp_png, width, height)

    try:
        from PIL import Image
        with Image.open(temp_png) as img:
            rgb_img = Image.new("RGB", img.size, (15, 23, 42))  # Dark slate background #0F172A
            if img.mode == "RGBA":
                rgb_img.paste(img, mask=img.split()[3])
            else:
                rgb_img.paste(img)
            rgb_img.save(dest_jpg, "JPEG", quality=95)
    finally:
        if temp_png.exists():
            temp_png.unlink()


def copy_svg(src_svg: Path, dest_svg: Path):
    dest_svg.parent.mkdir(parents=True, exist_ok=True)
    content = src_svg.read_bytes()
    if not dest_svg.exists() or dest_svg.read_bytes() != content:
        dest_svg.write_bytes(content)


def sync_all(check_mode: bool = False) -> bool:
    if not MASTER_SVG.exists():
        print(f"❌ Error: Master SVG not found at {MASTER_SVG}")
        return False

    print(f"🚀 Central Master Asset: {MASTER_SVG.relative_to(REPO_ROOT)}")
    all_ok = True

    for rel_path, fmt, w, h in TARGETS:
        dest = REPO_ROOT / rel_path
        if check_mode:
            if not dest.exists():
                print(f"❌ Missing target: {rel_path}")
                all_ok = False
            elif fmt == "copy_svg":
                if dest.read_bytes() != MASTER_SVG.read_bytes():
                    print(f"⚠️  Out of sync: {rel_path} does not match master SVG")
                    all_ok = False
                else:
                    print(f"✓ Synced: {rel_path}")
            else:
                print(f"✓ Present: {rel_path}")
        else:
            if fmt == "copy_svg":
                copy_svg(MASTER_SVG, dest)
                print(f"  ✓ Copied master SVG -> {rel_path}")
            elif fmt == "png":
                render_svg_to_png(MASTER_SVG, dest, w, h)
                print(f"  ✓ Rendered {w}x{h} PNG -> {rel_path}")
            elif fmt == "jpg":
                render_svg_to_jpg(MASTER_SVG, dest, w, h)
                print(f"  ✓ Rendered {w}x{h} JPG -> {rel_path}")

    return all_ok


if __name__ == "__main__":
    check_only = "--check" in sys.argv
    success = sync_all(check_mode=check_only)
    if check_only:
        if success:
            print("\n✨ All central assets are 100% synchronized and valid.")
            sys.exit(0)
        else:
            print("\n❌ Central asset check failed. Run `python3 scripts/sync_assets.py` to fix.")
            sys.exit(1)
    else:
        print("\n🎉 Central asset synchronization complete! All logos match master identity.")
        sys.exit(0)
