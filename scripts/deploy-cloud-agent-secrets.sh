#!/bin/bash
# Push Secure Credential Vault keys to the AswitchI Cloud Agent

set -e

cd "$(dirname "$0")/../workers/cloud-agent"

echo "Fetching Google API Key from secure-cred-vault..."
KEY=$(cred get aswitchi google_api_key)

if [ -z "$KEY" ]; then
    echo "Error: 'aswitchi/google_api_key' not found in vault."
    echo "Please set it first using: cred set aswitchi google_api_key"
    exit 1
fi

echo "$KEY" | CLOUDFLARE_ACCOUNT_ID="26b9a1161cddac39ae8970865a56747c" npx wrangler secret put GOOGLE_API_KEY
echo "✅ Secrets successfully deployed to the Cloud Agent worker!"
