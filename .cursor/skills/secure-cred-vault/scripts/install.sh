#!/usr/bin/env bash
# Install the `cred` command as a shell alias for the current user.
set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CRED_BIN="$SKILL_DIR/scripts/cred-store.sh"
MARKER="# >>> secure-cred-vault >>>"
END_MARKER="# <<< secure-cred-vault <<<"

[ -x "$CRED_BIN" ] || chmod +x "$CRED_BIN"

BLOCK=$(cat <<EOF
$MARKER
# Secure Credential Vault — https:// (local skill)
alias cred='$CRED_BIN'
export CRED_STORE_DIR="\${CRED_STORE_DIR:-/mnt/NewVolume/Personal_Projects/cred}"
$END_MARKER
EOF
)

install_into() {
  local rc="$1"
  mkdir -p "$(dirname "$rc")"
  touch "$rc"
  if grep -qF "$MARKER" "$rc" 2>/dev/null; then
    # Replace existing block
    local tmp
    tmp="$(mktemp)"
    awk -v start="$MARKER" -v end="$END_MARKER" '
      $0 == start {skip=1; next}
      $0 == end {skip=0; next}
      !skip {print}
    ' "$rc" > "$tmp"
    printf '\n%s\n' "$BLOCK" >> "$tmp"
    mv "$tmp" "$rc"
    echo "updated: $rc"
  else
    printf '\n%s\n' "$BLOCK" >> "$rc"
    echo "installed: $rc"
  fi
}

install_into "$HOME/.bashrc"
install_into "$HOME/.zshrc"

# Ensure vault directory exists with best-effort tight perms
mkdir -p /mnt/NewVolume/Personal_Projects/cred
chmod 700 /mnt/NewVolume/Personal_Projects/cred 2>/dev/null || true

echo
echo "Done. Reload your shell:"
echo "  source ~/.bashrc   # bash"
echo "  source ~/.zshrc    # zsh"
echo
echo "Then:  cred help"
echo "       cred init     # if vault not created yet"
echo "       cred list"
