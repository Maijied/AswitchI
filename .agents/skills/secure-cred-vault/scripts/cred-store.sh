#!/usr/bin/env bash
# cred-store.sh — passphrase-encrypted, category-organized credential vault.
#
# Backend : GnuPG symmetric (AES-256). Deps: gpg, jq (shred optional).
# On-disk : always ciphertext ($STORE_FILE). Decrypts to a category-organized
#           plain JSON only transiently — in shell memory, or (for `edit`) in a
#           tmpfs file that is shredded on exit. Plaintext never lands on the
#           store volume.
#
# The passphrase and secret values are read with hidden input from the tty and
# are passed to gpg over a dedicated file descriptor — never via argv (so they
# never appear in `ps`) and never via a file on disk.
#
# RESET / RECOVERY ("PIN") SYSTEM
#   On `init` a random recovery key is generated and saved to a local 0600 file
#   ($RECOVERY_KEY_FILE). A mirror copy of the vault is kept, encrypted with that
#   recovery key ($RECOVERY_FILE). If you ever forget the passphrase you can run
#   `reset-pass` to set a new passphrase WITHOUT losing data (it decrypts the
#   mirror with the recovery key). `reset --wipe` starts over from scratch.
#
# AUTOMATION
#   Set CRED_PASSPHRASE (and optionally CRED_RECOVERY_KEY) in the environment to
#   run non-interactively. This trades some secrecy for convenience — use only
#   on a trusted machine, and prefer the hidden tty prompts when you can.
set -euo pipefail
umask 077

STORE_DIR="${CRED_STORE_DIR:-/mnt/NewVolume/Personal_Projects/cred}"
STORE_FILE="${CRED_STORE_FILE:-$STORE_DIR/credentials.json.gpg}"
RECOVERY_FILE="${CRED_RECOVERY_FILE:-$STORE_DIR/credentials.recovery.gpg}"
RECOVERY_KEY_FILE="${CRED_RECOVERY_KEY_FILE:-$STORE_DIR/.recovery.key}"

PASS=""
DATA=""

err()  { printf '%s\n' "$*" >&2; }
die()  { err "error: $*"; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "missing dependency: $1"; }

need gpg
need jq

read_secret() { # $1=prompt -> REPLYVAL
  if [ -n "${CRED_VALUE:-}" ]; then
    REPLYVAL="$CRED_VALUE"
    return
  fi
  local v
  read -rs -p "$1" v </dev/tty
  echo >&2
  REPLYVAL="$v"
}

read_pass() { # sets global PASS (env override first, else hidden prompt)
  if [ -n "${CRED_PASSPHRASE:-}" ]; then PASS="$CRED_PASSPHRASE"; return; fi
  read_secret "${1:-Vault passphrase: }"
  [ -n "$REPLYVAL" ] || die "empty passphrase"
  PASS="$REPLYVAL"
}

gen_recovery_key() { # 32 hex chars from the kernel CSPRNG (no extra deps)
  od -An -tx1 -N16 /dev/urandom | tr -d ' \n'
}

get_recovery_key() { # echoes recovery key from env or file, or empty
  if [ -n "${CRED_RECOVERY_KEY:-}" ]; then printf '%s' "$CRED_RECOVERY_KEY"; return; fi
  [ -f "$RECOVERY_KEY_FILE" ] && cat "$RECOVERY_KEY_FILE"
}

gpg_dec_file() { # $1=file, $2=secret -> stdout
  gpg --batch --quiet --yes --pinentry-mode loopback --passphrase-fd 3 \
      -d "$1" 3< <(printf '%s' "$2")
}

gpg_enc_file() { # stdin -> $1=file (atomic), $2=secret
  local out="$1" secret="$2" tmp
  tmp="$(mktemp "${STORE_DIR}/.tmp.XXXXXX")"
  if ! gpg --batch --quiet --yes --pinentry-mode loopback --passphrase-fd 3 \
        -c --cipher-algo AES256 -o "$tmp" 3< <(printf '%s' "$secret"); then
    rm -f "$tmp"
    die "encryption failed"
  fi
  chmod 600 "$tmp" 2>/dev/null || true
  mv -f "$tmp" "$out"
}

load_store() { # decrypt STORE_FILE into $DATA (or {} if none)
  if [ -f "$STORE_FILE" ]; then
    if ! DATA="$(gpg_dec_file "$STORE_FILE" "$PASS" 2>/dev/null)"; then
      die "could not decrypt $STORE_FILE (wrong passphrase? try: cred reset-pass)"
    fi
    printf '%s' "$DATA" | jq -e . >/dev/null 2>&1 \
      || die "decrypted content is not valid JSON"
  else
    DATA="{}"
  fi
}

save_store() { # encrypt $DATA to STORE_FILE (passphrase) + recovery mirror (recovery key)
  printf '%s' "$DATA" | gpg_enc_file "$STORE_FILE" "$PASS"
  local rkey
  rkey="$(get_recovery_key || true)"
  if [ -n "$rkey" ]; then
    printf '%s' "$DATA" | gpg_enc_file "$RECOVERY_FILE" "$rkey"
  else
    err "note: no recovery key found — recovery mirror NOT updated."
    err "      run \`cred recovery-init\` to enable passphrase reset."
  fi
}

ensure_dir() {
  mkdir -p "$STORE_DIR"
  chmod 700 "$STORE_DIR" 2>/dev/null || true
  local perms
  perms="$(stat -c '%a' "$STORE_DIR" 2>/dev/null || echo '?')"
  if [ "$perms" != "700" ]; then
    err "note: could not enforce 700 perms on $STORE_DIR (perms=$perms)."
    err "      the file is still encrypted at rest, but this volume may not"
    err "      support Unix permissions (e.g. NTFS/exFAT)."
  fi
}

write_recovery_key() { # $1=key ; store 0600 + show once
  printf '%s' "$1" > "$RECOVERY_KEY_FILE"
  chmod 600 "$RECOVERY_KEY_FILE" 2>/dev/null || true
}

cmd_init() {
  ensure_dir
  [ -f "$STORE_FILE" ] && die "vault already exists: $STORE_FILE (use reset --wipe to replace)"
  read_pass "Create a passphrase for the new vault: "
  local first="$PASS"
  if [ -z "${CRED_PASSPHRASE:-}" ]; then
    read_pass "Confirm passphrase: "
    [ "$first" = "$PASS" ] || die "passphrases do not match"
  fi
  local rkey
  rkey="$(gen_recovery_key)"
  write_recovery_key "$rkey"
  DATA="{}"
  save_store
  err "created empty vault: $STORE_FILE"
  err ""
  err "  RECOVERY KEY (saved to $RECOVERY_KEY_FILE):"
  err "      $rkey"
  err "  Keep a copy somewhere safe. With it, \`cred reset-pass\` can set a new"
  err "  passphrase without losing data if you forget the current one."
}

cmd_recovery_init() { # (re)generate a recovery key + mirror for an existing vault
  read_pass
  load_store
  local rkey
  rkey="$(gen_recovery_key)"
  write_recovery_key "$rkey"
  save_store
  err "recovery key regenerated: $RECOVERY_KEY_FILE"
  err "      $rkey"
}

cmd_recovery_show() {
  local rkey
  rkey="$(get_recovery_key || true)"
  [ -n "$rkey" ] || die "no recovery key found at $RECOVERY_KEY_FILE"
  printf '%s\n' "$rkey"
}

cmd_reset_pass() { # reset passphrase using the recovery key (no data loss)
  [ -f "$RECOVERY_FILE" ] || die "no recovery mirror ($RECOVERY_FILE); cannot reset"
  local rkey
  rkey="$(get_recovery_key || true)"
  [ -n "$rkey" ] || read_secret "Recovery key: " && rkey="${rkey:-$REPLYVAL}"
  [ -n "$rkey" ] || die "empty recovery key"
  if ! DATA="$(gpg_dec_file "$RECOVERY_FILE" "$rkey" 2>/dev/null)"; then
    die "recovery mirror did not decrypt (wrong recovery key?)"
  fi
  printf '%s' "$DATA" | jq -e . >/dev/null 2>&1 || die "recovery data is not valid JSON"
  local new1
  read_pass "New passphrase: "; new1="$PASS"
  if [ -z "${CRED_PASSPHRASE:-}" ]; then
    read_pass "Confirm new passphrase: "
    [ "$new1" = "$PASS" ] || die "new passphrases do not match"
  fi
  save_store
  err "passphrase reset from recovery key (data preserved)"
}

cmd_reset() { # destructive wipe + fresh init  (use: reset --wipe)
  if [ "${1:-}" != "--wipe" ]; then
    die "refusing to wipe. To erase the vault and start over: cred reset --wipe"
  fi
  ensure_dir
  local f
  for f in "$STORE_FILE" "$RECOVERY_FILE" "$RECOVERY_KEY_FILE"; do
    [ -f "$f" ] || continue
    if command -v shred >/dev/null 2>&1; then shred -u "$f" 2>/dev/null || rm -f "$f"
    else rm -f "$f"; fi
  done
  err "vault wiped."
  cmd_init
}

cmd_set() {
  local cat="${1:?usage: set <category> <key>}" key="${2:?usage: set <category> <key>}"
  ensure_dir
  read_pass
  load_store
  local val
  if [ -n "${CRED_VALUE:-}" ]; then
    val="$CRED_VALUE"
  else
    read_secret "Enter value for ${cat}/${key}: "
    val="$REPLYVAL"
  fi
  [ -n "$val" ] || die "empty value"
  DATA="$(printf '%s' "$DATA" | jq --arg c "$cat" --arg k "$key" --arg v "$val" \
      '.[$c] = ((.[$c] // {}) + {($k): $v})')"
  save_store
  err "stored ${cat}/${key}"
}

cmd_get() {
  local cat="${1:?usage: get <category> <key> [--copy]}" key="${2:?usage: get <category> <key> [--copy]}"
  read_pass
  load_store
  local val
  val="$(printf '%s' "$DATA" | jq -r --arg c "$cat" --arg k "$key" '.[$c][$k] // empty')"
  [ -n "$val" ] || die "not found: ${cat}/${key}"
  if [ "${3:-}" = "--copy" ]; then
    if   command -v wl-copy >/dev/null 2>&1; then printf '%s' "$val" | wl-copy
    elif command -v xclip   >/dev/null 2>&1; then printf '%s' "$val" | xclip -selection clipboard
    else die "no clipboard tool found (install wl-clipboard or xclip)"; fi
    err "copied ${cat}/${key} to clipboard"
  else
    printf '%s\n' "$val"
  fi
}

cmd_list() {
  read_pass
  load_store
  printf '%s' "$DATA" \
    | jq -r 'to_entries[] | .key as $c | (.value | keys[]?) | "\($c)/\(.)"' \
    | sort
}

cmd_env() {
  local cat="${1:?usage: env <category>}"
  read_pass
  load_store
  printf '%s' "$DATA" \
    | jq -r --arg c "$cat" '.[$c] // {} | to_entries[] | "export \(.key)=\(.value|@sh)"'
}

cmd_rm() {
  local cat="${1:?usage: rm <category> <key>}" key="${2:?usage: rm <category> <key>}"
  read_pass
  load_store
  DATA="$(printf '%s' "$DATA" | jq --arg c "$cat" --arg k "$key" \
      'if .[$c] then .[$c] |= del(.[$k]) else . end
       | if (.[$c] == {}) then del(.[$c]) else . end')"
  save_store
  err "removed ${cat}/${key}"
}

cmd_edit() {
  read_pass
  load_store
  local base tmpd f
  base="${XDG_RUNTIME_DIR:-/dev/shm}"
  [ -d "$base" ] || base="${TMPDIR:-/tmp}"
  tmpd="$(mktemp -d "${base}/crededit.XXXXXX")"
  # shellcheck disable=SC2064
  trap "find '$tmpd' -type f -exec shred -u {} + 2>/dev/null; rm -rf '$tmpd'" EXIT
  f="$tmpd/credentials.json"
  printf '%s\n' "$DATA" | jq . > "$f"
  "${EDITOR:-nano}" "$f"
  jq -e . "$f" >/dev/null 2>&1 || die "invalid JSON — vault NOT changed"
  DATA="$(cat "$f")"
  save_store
  err "vault updated"
}

cmd_rekey() {
  read_pass "Current passphrase: "
  load_store
  local new1
  read_pass "New passphrase: "; new1="$PASS"
  read_pass "Confirm new passphrase: "
  [ "$new1" = "$PASS" ] || die "new passphrases do not match"
  save_store
  err "passphrase changed"
}

usage() {
  cat >&2 <<EOF
cred-store.sh — passphrase-encrypted credential vault (gpg AES-256 + jq)

Store file:    $STORE_FILE
Recovery file: $RECOVERY_FILE
Recovery key:  $RECOVERY_KEY_FILE
Override with env: CRED_STORE_DIR, CRED_STORE_FILE, CRED_RECOVERY_FILE,
                   CRED_RECOVERY_KEY_FILE
Automation env:    CRED_PASSPHRASE, CRED_RECOVERY_KEY, CRED_VALUE (set only)

Commands:
  init                      create a new empty vault (+ recovery key)
  set <category> <key>      add/update a credential (value typed hidden)
  get <category> <key>      print a value on stdout   (add --copy for clipboard)
  list                      list category/key names only (never values)
  env <category>            print \`export KEY=VALUE\` lines to eval in a shell
  edit                      open the decrypted JSON in \$EDITOR, re-encrypt on save
  rm  <category> <key>      delete a credential
  rekey                     change the passphrase (needs current passphrase)
  reset-pass                reset a FORGOTTEN passphrase using the recovery key
  reset --wipe              erase the vault + recovery and start over (destructive)
  recovery-init             (re)generate the recovery key for an existing vault
  recovery-show             print the recovery key
  path                      print the vault file path

Examples:
  cred-store.sh init
  cred-store.sh set cursor cloudflare_api_token
  export CF_TOKEN="\$(cred-store.sh get cursor cloudflare_api_token)"
  eval "\$(cred-store.sh env cursor)"
EOF
}

main() {
  local cmd="${1:-}"; shift || true
  case "$cmd" in
    init)          cmd_init "$@";;
    set)           cmd_set "$@";;
    get)           cmd_get "$@";;
    list)          cmd_list "$@";;
    env)           cmd_env "$@";;
    rm)            cmd_rm "$@";;
    edit)          cmd_edit "$@";;
    rekey)         cmd_rekey "$@";;
    reset-pass)    cmd_reset_pass "$@";;
    reset)         cmd_reset "$@";;
    recovery-init) cmd_recovery_init "$@";;
    recovery-show) cmd_recovery_show "$@";;
    path)          printf '%s\n' "$STORE_FILE";;
    ""|-h|--help|help) usage;;
    *) err "unknown command: $cmd"; usage; exit 2;;
  esac
}

main "$@"
