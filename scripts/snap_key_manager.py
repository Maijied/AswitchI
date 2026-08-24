#!/usr/bin/env python3
"""
Snap Key Manager (Lorapok Labs)
Generates and securely vaults unique Ed25519 SSH keys for each snap deployment.
"""

import sys
import os
import subprocess
import json
from datetime import datetime

VAULT_PATH = "/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg"
PASSPHRASE = os.environ.get("CRED_PASSPHRASE", "565087")

def generate_and_vault_snap_key(app_name="aswitchi"):
    ssh_dir = os.path.expanduser("~/.ssh")
    os.makedirs(ssh_dir, mode=0o700, exist_ok=True)
    
    key_path = os.path.join(ssh_dir, f"id_ed25519_snap_{app_name}")
    pub_path = f"{key_path}.pub"
    comment = f"snap-{app_name}-deploy@lorapok.tech"

    if os.path.exists(key_path):
        print(f"ℹ️ Key already exists at {key_path}")
    else:
        cmd = ["ssh-keygen", "-t", "ed25519", "-C", comment, "-f", key_path, "-N", ""]
        subprocess.run(cmd, check=True)
        print(f"✅ Generated new unique Ed25519 SSH key for '{app_name}'")

    with open(pub_path, "r") as f:
        pub_key = f.read().strip()
    with open(key_path, "r") as f:
        priv_key = f.read().strip()

    # Get fingerprint
    fp_proc = subprocess.run(["ssh-keygen", "-lf", pub_path], stdout=subprocess.PIPE, text=True)
    fingerprint = fp_proc.stdout.strip().split()[1] if fp_proc.stdout else ""

    # Decrypt vault
    decrypt_cmd = ["gpg", "--batch", "--yes", "--passphrase", PASSPHRASE, "--decrypt", VAULT_PATH]
    proc = subprocess.run(decrypt_cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    
    data = {}
    if proc.returncode == 0:
        data = json.loads(proc.stdout)
    
    if "snap_deployments" not in data:
        data["snap_deployments"] = {}

    data["snap_deployments"][app_name] = {
        "app_name": app_name,
        "created_at": datetime.now().isoformat(),
        "key_type": "ed25519",
        "comment": comment,
        "public_key": pub_key,
        "private_key": priv_key,
        "public_key_file": f"~/.ssh/id_ed25519_snap_{app_name}.pub",
        "private_key_file": f"~/.ssh/id_ed25519_snap_{app_name}",
        "fingerprint": fingerprint
    }

    encrypt_cmd = [
        "gpg", "--batch", "--yes", "--passphrase", PASSPHRASE,
        "--symmetric", "--cipher-algo", "AES256",
        "--output", VAULT_PATH
    ]
    enc_proc = subprocess.run(encrypt_cmd, input=json.dumps(data, indent=2), stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if enc_proc.returncode == 0:
        print(f"🔒 Successfully vaulted unique deployment key in {VAULT_PATH}")
    else:
        print(f"❌ Failed to encrypt vault: {enc_proc.stderr}")

    print("\n--- PUBLIC KEY FOR IMPORT ---")
    print(pub_key)
    print("-----------------------------\n")
    return pub_key

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "aswitchi"
    generate_and_vault_snap_key(target)
