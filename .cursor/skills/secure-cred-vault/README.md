# Secure Credential Vault — Complete Project Guide

**What this is:** a standalone credential project used by *every* AI agent (Cursor, Claude Code, Cowork) and by you in the terminal. Secrets live in one passphrase-encrypted JSON vault; agents never paste or echo raw values.

| Item | Path |
|------|------|
| Vault (encrypted data) | `/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg` |
| Human guides in vault folder | `/mnt/NewVolume/Personal_Projects/cred/HOW_TO_USE.md` |
| Skill (AI + CLI) | `/home/maizied/.claude/skills/secure-cred-vault/` |
| CLI entrypoint | `cred` → `scripts/cred-store.sh` |

---

## 0. Prerequisites

```bash
command -v gpg jq
# if missing:
sudo apt-get install -y gnupg jq
```

Optional for clipboard copy: `wl-clipboard` or `xclip`.

---

## 1. Installation (one time)

```bash
bash /home/maizied/.claude/skills/secure-cred-vault/scripts/install.sh
source ~/.zshrc    # or: source ~/.bashrc
cred help
```

What install does:
- Makes `cred-store.sh` executable
- Adds a `cred` alias to `~/.bashrc` and `~/.zshrc`
- Sets default `CRED_STORE_DIR` to `/mnt/NewVolume/Personal_Projects/cred`
- Ensures the vault directory exists

---

## 2. Initialize the vault (one time)

```bash
cred init
# create + confirm a passphrase — remember it (password manager)
```

Creates `credentials.json.gpg` (AES-256 ciphertext).

If you see `VAULT_PASSPHRASE_READ_ONCE.txt`:
1. Copy the passphrase into your password manager
2. Delete that file immediately

---

## 3. Store credentials

```bash
cred set <category> <key>
# prompts (hidden): vault passphrase, then the secret value
```

**Category conventions**

| Category | Keys |
|----------|------|
| `cloudflare` | `api_token`, `account_id`, … |
| `github` | `pat`, `token` |
| `openai` | `api_key` |
| `stripe` | `secret_key` |
| `postgres_prod` | `url`, `password` |

Rules:
- Lowercase categories and keys
- Related fields share one category
- Never pass the secret on the command line (`cred set x y SECRET` is forbidden)

---

## 4. List / get / use in any project

```bash
cred list                              # names only (safe)
cred get cloudflare api_token          # print one value
cred get cloudflare api_token --copy   # clipboard
eval "$(cred env cloudflare)"          # export all keys in category

# in a project shell:
export CF_API_TOKEN="$(cred get cloudflare api_token)"
export CF_ACCOUNT_ID="$(cred get cloudflare account_id)"
```

Prefer runtime env injection. If a tool needs `.env`, generate it locally and keep it gitignored — never commit secrets.

---

## 5. Edit / remove / rekey / backup

```bash
cred edit                 # open decrypted JSON in $EDITOR (tmpfs), re-encrypt on save
cred rm <category> <key>
cred rekey                # change passphrase
cred path                 # print vault file path
```

Backup: copy `credentials.json.gpg` anywhere (it is encrypted). Losing the passphrase = permanent loss.

---

## 6. End-to-end checklist

- [ ] `gpg` + `jq` installed
- [ ] `install.sh` run; `cred help` works
- [ ] `cred init` done; passphrase in password manager
- [ ] `VAULT_PASSPHRASE_READ_ONCE.txt` deleted (if it existed)
- [ ] At least one `cred set …` done
- [ ] `cred list` shows expected `category/key` names
- [ ] A project can `export VAR="$(cred get …)"` successfully
- [ ] AI agents load this skill (see AGENTS.md / SKILL.md)

---

## 7. AI agents (required behavior)

Every agent that can load skills **must** use this vault for credentials. Full rules: [SKILL.md](./SKILL.md) and [AGENTS.md](./AGENTS.md).

Summary:
1. Never save a secret pasted in chat — tell the user to rotate and `cred set` themselves
2. Never print decrypted values into the conversation
3. Use `cred list` for discovery; guide `cred set` / `cred get` for store/retrieve
4. Wire projects with name-based references only

---

## 8. Troubleshooting

| Symptom | Fix |
|---------|-----|
| `cred: command not found` | Re-run `install.sh`, then `source ~/.zshrc` |
| `gpg` / `jq` missing | `sudo apt-get install -y gnupg jq` |
| Decrypt failed | Wrong passphrase |
| Folder world-writable | NTFS/exFAT volume — data still encrypted; prefer Linux FS when possible |
| Skill not triggering | Ensure `SKILL.md` is under `~/.claude/skills/secure-cred-vault/` (and Cursor skills if used) |

---

## Project layout

```
~/.claude/skills/secure-cred-vault/
├── README.md          ← this file (install → end)
├── AGENTS.md          ← mandatory agent rules
├── SKILL.md           ← skill trigger + assistant workflow
├── scripts/
│   ├── cred-store.sh  ← vault CLI
│   └── install.sh     ← shell alias installer
└── evals/evals.json

/mnt/NewVolume/Personal_Projects/cred/
├── credentials.json.gpg
├── HOW_TO_USE.md
└── README.md
```
