# Canonical Ubuntu Snap Store Review Guide — AswitchI

This document provides the formal justification and architectural documentation for Canonical Snap Store reviewers regarding the `classic` confinement request and packaging integrity of **AswitchI**.

---

## 1. Confinement Rationale (`confinement: classic`)

According to [Canonical's Classic Confinement Policy](https://snapcraft.io/docs/classic-confinement), applications categorized as developer tools, environment switchers, and system application launchers qualify for classic confinement.

AswitchI functions strictly as a native **Linux Application Switcher & Launchpad** specifically engineered for AI developer productivity. It requires classic confinement for the following explicit operational reasons:

1. **Host Desktop Discovery (`XDG_DATA_DIRS`)**:
   - AswitchI scans `/usr/share/applications`, `/usr/local/share/applications`, `/var/lib/snapd/desktop/applications`, and Flatpak export directories to detect user-installed desktop AI IDEs (Cursor, Windsurf, Kiro, Antigravity, Claude Desktop).
   - Under `strict` confinement, AppArmor mount namespaces restrict filesystem inspection, hiding all host-installed IDEs and applications from the user.

2. **Process Tree Monitoring (`ps -eo args`)**:
   - AswitchI displays live active running status indicators (green running dots on the macOS-style dock and launchpad grid) for user processes (e.g. `cursor`, `windsurf`, `ollama`, `kiro-ide`).
   - Under `strict` confinement, `/proc` is sandboxed, preventing the switcher from detecting running processes.

3. **External IDE & CLI Execution**:
   - AswitchI launches external host desktop environments and spawns terminal-based CLI agents (`gnome-terminal -e ...` or user's default terminal emulator for `agy`, `aider`, `claude`, `open-interpreter`).
   - `strict` confinement prevents executing arbitrary host binaries outside the snap core.

---

## 2. Package & Desktop Integration Metadata

- **Package Name**: `aswitchi`
- **Application Binary**: `opt/aswitchi/bin/aswitchi`
- **Desktop Entry**: `usr/share/applications/aswitchi.desktop` (`desktop: usr/share/applications/aswitchi.desktop`)
- **Icon**: `assets/icon.png` (High-res 512x512 PNG conforming to Freedesktop icon specification)
- **Base**: `core22`
- **License**: `GPL-3.0-or-later` (Matching root `LICENSE`, `snapcraft.yaml`, and `package.json`)
- **Primary Website**: `https://aswitchi.lorapok.tech`
- **Source Code**: `https://github.com/Maijied/AswitchI`
- **Issue Tracker**: `https://github.com/Maijied/AswitchI/issues`
- **Maintainer / Contact**: `lorapokdev@gmail.com` / `maizied@lorapok.tech`

---

## 3. Store Assets & Screenshots

All high-definition screenshots, video showcases, and banners conforming to Canonical's 16:9 and 3:1 banner guidelines are located under `snap_store_assets/`:
- `banner.jpg` (Full-width banner)
- `banner_3x1.jpg` (Canonical recommended 3:1 banner)
- `logo_512x512.png` (Canonical standard icon)
- `screenshot_1_launchpad.jpg` (Launchpad 7-column view)
- `screenshot_2_webai.jpg` (Persistent In-App Web AI view)
- `screenshot_3_dock.jpg` (3D Glass Reflective Dock)
- `screenshot_4_projects.jpg` (Workspace Projects Explorer)
- `promo_video_with_audio.mp4` (Official Promo Video)

---

## 4. Verification Commands

To verify the snap package locally or run review tools:
```bash
# Expand and validate snapcraft schema
snapcraft expand-extensions

# Run test suite
python3 tests/run_all_tests.py
```
