---
name: secure-cred-vault
description: >-
  Canonical credential vault for ALL projects on this machine. Use this skill
  whenever ANY agent (Cursor, Claude Code, Cowork) or the user deals with API
  keys, tokens, secrets, passwords, connection strings, .env values, Cloudflare
  auth, GitHub PATs, OpenAI keys, or “save/store credentials” — even if they
  never say vault/encrypt. Store/retrieve via passphrase-encrypted category JSON
  at /mnt/NewVolume/Personal_Projects/cred/ using `cred` (scripts/cred-store.sh).
  Never paste secrets into chat or plaintext files; user types values at hidden
  prompts; agents reference secrets by name only. Read AGENTS.md + README.md.
---

# Secure Credential Vault

**Complete process (install → end):** [README.md](./README.md)  
**Mandatory agent rules:** [AGENTS.md](./AGENTS.md)  
**Vault folder guide:** `/mnt/NewVolume/Personal_Projects/cred/HOW_TO_USE.md`

## What it is

One **passphrase-encrypted** file that decrypts to **category-organized plain JSON**:

```json
{
  "cloudflare": { "api_token": "…", "account_id": "…" },
  "github":     { "pat": "…" }
}
```

Path: `/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg`  
Backend: GnuPG AES-256 + jq via `scripts/cred-store.sh` (`cred` after install).

## Golden rules (all AI agents)

1. **Never save a secret pasted in chat.** Tell user to rotate, then `cred set` themselves.
2. **Never print decrypted values** into the conversation. `cred list` = names only.
3. **Never put secrets in argv** or store the vault passphrase.
4. **Wire projects by name:** `export X="$(cred get category key)"`.
5. Prefer **scoped API tokens** over Cloudflare Global API Keys.

## Install + init (if missing)

```bash
bash /home/maizied/.claude/skills/secure-cred-vault/scripts/install.sh
source ~/.zshrc   # or ~/.bashrc
cred init         # only if vault file missing
```

## Store / use

```bash
cred set <category> <key>          # user types value
cred list
cred get <category> <key>
eval "$(cred env <category>)"
```

## If user pasted a secret in chat

1. Say it is exposed → rotate at provider.  
2. Do not write the pasted value anywhere.  
3. Have them `cred set <cat> <key>` with the new value.

## Categories

`cloudflare`, `github`, `openai`, `stripe`, `postgres_prod`, plus project-specific lowercase names.
