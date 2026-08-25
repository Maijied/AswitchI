#!/bin/bash
# AswitchI Secret Configuration Utility
# Safely configures GitHub and Cloudflare secrets without exposing them in shell history.

set -e

echo "==============================================="
echo " AswitchI Mission Control Secret Configuration"
echo "==============================================="
echo "This script securely uploads your tokens to Cloudflare Workers."
echo ""

# Ensure we are in the correct directory
cd "$(dirname "$0")/../workers/github-proxy"

printf "1. Enter your GitHub Personal Access Token (typing hidden): "
read -s GITHUB_PAT
echo
if [ -z "$GITHUB_PAT" ]; then
    echo "Error: GitHub PAT cannot be empty."
    exit 1
fi

echo "$GITHUB_PAT" | npx wrangler secret put GITHUB_PAT
echo "✅ GITHUB_PAT securely saved to Cloudflare!"
echo ""

printf "2. Enter your Emergency Vault PIN [Default: 565087] (typing hidden): "
read -s VAULT_PIN
echo
if [ -z "$VAULT_PIN" ]; then
    VAULT_PIN="565087"
fi

echo "$VAULT_PIN" | npx wrangler secret put ADMIN_SECRET
echo "✅ ADMIN_SECRET securely saved to Cloudflare!"
echo ""
echo "Configuration complete. Mission Control backend is fully operational."
