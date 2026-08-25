# AGENTS.md — Secure Credential Vault

**Audience:** every AI agent (Cursor Agent, Claude Code, Cowork, Cloud Agents).

This project is the **canonical credential store** for Maizied's machine. Load and follow it whenever credentials, API keys, tokens, secrets, `.env` values, or provider auth appear — in *any* repo or chat.

## When to use

Trigger on: credentials, secrets, API keys/tokens, passwords, connection strings, “save this key”, “where do I put secrets”, wiring env vars, Cloudflare/GitHub/OpenAI auth, rotating leaked keys.

## Hard rules

1. **Never write a secret the user pasted in chat** into the vault, a file, git, or logs. Say it is exposed → rotate at the provider → user runs `cred set <category> <key>` themselves.
2. **Never print decrypted secret values** into the assistant transcript. `cred list` (names only) is OK.
3. **Never put secrets in argv** (`cred set x y VALUE`). Always hidden tty prompts via the CLI.
4. **Never store or ask for the vault passphrase** in chat.
5. **Reference by name in code/docs**, e.g. `export TOKEN="$(cred get cloudflare api_token)"`.

## Paths

| Role | Path |
|------|------|
| CLI | `cred` (after install) or `/home/maizied/.claude/skills/secure-cred-vault/scripts/cred-store.sh` |
| Vault | `/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg` |
| Install | `bash /home/maizied/.claude/skills/secure-cred-vault/scripts/install.sh` |
| Full human guide | `README.md` in this skill directory |
| Vault folder guide | `/mnt/NewVolume/Personal_Projects/cred/HOW_TO_USE.md` |

## Agent workflow

1. If `cred` missing → run `install.sh` (or tell user once), then continue.
2. Discover with `cred list` only (user types passphrase in their terminal if needed).
3. To store: instruct `cred set <category> <key>` — do not accept the value in chat.
4. To use in a project: inject via `cred get` / `cred env` into env vars; keep `.env` gitignored if created.
5. If user pastes a Cloudflare Global API Key or any raw secret → refuse to save it; require rotation + scoped token + `cred set`.

## Categories (preferred)

`cloudflare`, `github`, `openai`, `stripe`, `postgres_prod`, plus project-specific lowercase names.

See `SKILL.md` for detailed assistant instructions and `README.md` for install → end process.
