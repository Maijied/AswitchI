#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ICON_PATH="${PROJECT_DIR}/assets/icon.svg"
BIN_TARGET="${HOME}/.local/bin/aswitchi"
DESKTOP_DIR="${HOME}/Desktop"
APPS_DIR="${HOME}/.local/share/applications"

mkdir -p "${HOME}/.local/bin" "${DESKTOP_DIR}" "${APPS_DIR}"

# 1. Update Symlink Binary
ln -sf "${PROJECT_DIR}/bin/aswitchi" "${BIN_TARGET}"
chmod +x "${BIN_TARGET}"

# 2. Desktop Launcher
cat << DESKTOP_EOF > "${DESKTOP_DIR}/AswitchI.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=AswitchI
GenericName=AI Launchpad & Switcher
Comment=Native macOS Launchpad & AI Switcher for Ubuntu
Exec=${BIN_TARGET}
Icon=${ICON_PATH}
Terminal=false
StartupNotify=true
Categories=Development;Utility;System;
StartupWMClass=aswitchi_native.py
DESKTOP_EOF
chmod +x "${DESKTOP_DIR}/AswitchI.desktop"

# 3. Application Menu Entry
cp "${DESKTOP_DIR}/AswitchI.desktop" "${APPS_DIR}/aswitchi.desktop"

# 4. Refresh Desktop Database & Icon Cache
if command -v update-desktop-database >/dev/null 2>&1; then
    update-desktop-database "${APPS_DIR}" 2>/dev/null || true
fi

if command -v gtk-update-icon-cache >/dev/null 2>&1; then
    gtk-update-icon-cache -f -t "${HOME}/.local/share/icons" 2>/dev/null || true
fi

echo "==> AswitchI successfully updated in Ubuntu App Menu & Desktop!"
echo "    • Binary: ${BIN_TARGET}"
echo "    • App Menu Entry: ${APPS_DIR}/aswitchi.desktop"
echo "    • Desktop Shortcut: ${DESKTOP_DIR}/AswitchI.desktop"
