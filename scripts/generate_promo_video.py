import cv2
import numpy as np
import os
import sys

def generate_video(image_paths, output_path, fps=30, display_duration=3.0, transition_duration=1.0):
    print("🎬 Starting video generation...")
    # Load and resize images to 1920x1080
    images = []
    width, height = 1920, 1080
    for path in image_paths:
        img = cv2.imread(path)
        if img is None:
            print(f"❌ Failed to load image: {path}")
            continue
        img = cv2.resize(img, (width, height))
        images.append(img)
        print(f"✓ Loaded {os.path.basename(path)}")

    if not images:
        print("❌ No images loaded.")
        sys.exit(1)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    display_frames = int(display_duration * fps)
    transition_frames = int(transition_duration * fps)

    for i in range(len(images)):
        # Static display
        for _ in range(display_frames):
            out.write(images[i])
        
        # Crossfade to next image (if not the last one)
        if i < len(images) - 1:
            for t in range(transition_frames):
                alpha = t / float(transition_frames)
                blended = cv2.addWeighted(images[i], 1 - alpha, images[i+1], alpha, 0)
                out.write(blended)

    out.release()
    print(f"✅ Video generated at: {output_path}")

if __name__ == '__main__':
    ASSETS_DIR = "/mnt/NewVolume/Personal_Projects/AswitchI/snap_store_assets"
    images = [
        os.path.join(ASSETS_DIR, "banner.jpg"),
        os.path.join(ASSETS_DIR, "screenshot_1_launchpad.jpg"),
        os.path.join(ASSETS_DIR, "screenshot_2_webai.jpg"),
        os.path.join(ASSETS_DIR, "screenshot_3_dock.jpg"),
        os.path.join(ASSETS_DIR, "screenshot_4_projects.jpg"),
    ]
    generate_video(images, os.path.join(ASSETS_DIR, "promo_video.mp4"))
