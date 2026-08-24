#!/bin/bash
set -e

echo "🎬 Generating Snap Store Promo Video (HD 1080p, 60fps)..."

ASSETS_DIR="/mnt/NewVolume/Personal_Projects/AswitchI/snap_store_assets"
OUTPUT_FILE="$ASSETS_DIR/promo_video.mp4"

# Generate the video with ffmpeg using zoompan and xfade
# We have 5 images (banner + 4 screenshots)
# Each image: 4s duration + 1s crossfade

ffmpeg -y \
  -loop 1 -t 5 -i "$ASSETS_DIR/banner.jpg" \
  -loop 1 -t 5 -i "$ASSETS_DIR/screenshot_1_launchpad.jpg" \
  -loop 1 -t 5 -i "$ASSETS_DIR/screenshot_2_webai.jpg" \
  -loop 1 -t 5 -i "$ASSETS_DIR/screenshot_3_dock.jpg" \
  -loop 1 -t 5 -i "$ASSETS_DIR/screenshot_4_projects.jpg" \
  -filter_complex "
    [0:v]format=yuv420p,scale=1920x1080,zoompan=z='min(zoom+0.0015,1.5)':d=300:s=1920x1080:fps=60[v0];
    [1:v]format=yuv420p,scale=1920x1080,zoompan=z='min(zoom+0.0015,1.5)':d=300:s=1920x1080:fps=60[v1];
    [2:v]format=yuv420p,scale=1920x1080,zoompan=z='min(zoom+0.0015,1.5)':d=300:s=1920x1080:fps=60[v2];
    [3:v]format=yuv420p,scale=1920x1080,zoompan=z='min(zoom+0.0015,1.5)':d=300:s=1920x1080:fps=60[v3];
    [4:v]format=yuv420p,scale=1920x1080,zoompan=z='min(zoom+0.0015,1.5)':d=300:s=1920x1080:fps=60[v4];
    [v0][v1]xfade=transition=fade:duration=1:offset=4[v01];
    [v01][v2]xfade=transition=fade:duration=1:offset=8[v012];
    [v012][v3]xfade=transition=fade:duration=1:offset=12[v0123];
    [v0123][v4]xfade=transition=fade:duration=1:offset=16[outv]
  " \
  -map "[outv]" -c:v libx264 -preset fast -crf 22 -pix_fmt yuv420p -movflags +faststart "$OUTPUT_FILE"

echo "✅ Promo video generated at: $OUTPUT_FILE"
