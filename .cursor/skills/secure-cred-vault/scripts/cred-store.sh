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
set -euo pipefail
umask 077

STORE_DIR="${CRED_STORE_DIR:-/mnt/NewVolume/Personal_Projects/cred}"
STORE_FILE="${CRED_STORE_FILE:-$STORE_DIR/credentials.json.gpg}"

PASS=""
DATA=""

err()  { printf '%s\n' "$*" >&2; }
die()  { err "error: $*"; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "missing dependency: $1"; }

need gpg
need jq

read_secret() { # $1=prompt -> echoes value on stdout of the function via REPLYVAL
  local v
  read -rs -p "$1" v </dev/tty
  echo >&2
  REPLYVAL="$v"
}

read_pass() { # sets global PASS (hidden)
  read_secret "${1:-Vault passphrase: }"
  [ -n "$REPLYVAL" ] || die "empty passphrase"
  PASS="$REPLYVAL"
}

gpg_dec() { # STORE_FILE -> stdout, using $PASS
  gpg --batch --quiet --yes --pinentry-mode loopback --passphrase-fd 3 \
      -d "$STORE_FILE" 3< <(printf '%s' "$PASS")
}

gpg_enc() { # stdin (plaintext) -> STORE_FILE (atomic), using $PASS
  local tmp
  tmp="$(mktemp "${STORE_DIR}/.tmp.XXXXXX")"
  # shellcheck disable=SC2094
  if ! gpg --batch --quiet --yes --pinentry-mode loopback --passphrase-fd 3 \
        -c --cipher-algo AES256 -o "$tmp" 3< <(printf '%s' "$PASS"); then
    rm -f "$tmp"
    die "encryption failed"
  fi
  chmod 600 "$tmp" 2>/dev/null || true
  mv -f "$tmp" "$STORE_FILE"
}

load_store() { # decrypt into $DATA (or {} if no store yet)
  if [ -f "$STORE_FILE" ]; then
    if ! DATA="$(gpg_dec 2>/dev/null)"; then
      die "could not decrypt $STORE_FILE (wrong passphrase?)"
    fi
    printf '%s' "$DATA" | jq -e . >/dev/null 2>&1 \
      || die "decrypted content is not valid JSON"
  else
    DATA="{}"
  fi
}

save_store() { # encrypt $DATA back to STORE_FILE
  printf '%s' "$DATA" | gpg_enc
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

cmd_init() {
  ensure_dir
  [ -f "$STORE_FILE" ] && die "vault already exists: $STORE_FILE"
  read_pass "Create a passphrase for the new vault: "
  local first="$PASS"
  read_pass "Confirm passphrase: "
  [ "$first" = "$PASS" ] || die "passphrases do not match"
  DATA="{}"
  save_store
  err "created empty vault: $STORE_FILE"
}

cmd_set() {
  local cat="${1:?usage: set <category> <key>}" key="${2:?usage: set <category> <key>}"
  ensure_dir
  read_pass
  load_store
  read_secret "Enter value for ${cat}/${key}: "
  local val="$REPLYVAL"
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
    printf '%s\n' "$val"   # value ONLY on stdout, so it can be captured in $(...)
  fi
}

cmd_list() {
  read_pass
  load_store
  printf '%s' "$DATA" \
    | jq -r 'to_entries[] | .key as $c | (.value | keys[]?) | "\($c)/\(.)"' \
    | sort
}

cmd_env() { # print `export KEY=VALUE` lines for a category (values ARE printed)
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

Store file: $STORE_FILE
Override with env: CRED_STORE_DIR, CRED_STORE_FILE

Commands:
  init                      create a new empty vault (asks for a passphrase)
  set <category> <key>      add/update a credential (value typed hidden)
  get <category> <key>      print a value on stdout   (add --copy for clipboard)
  list                      list category/key names only (never values)
  env <category>            print \`export KEY=VALUE\` lines to eval in a shell
  edit                      open the decrypted JSON in \$EDITOR, re-encrypt on save
  rm  <category> <key>      delete a credential
  rekey                     change the vault passphrase
  path                      print the vault file path

Examples:
  cred-store.sh init
  cred-store.sh set cloudflare api_token
  export CF_API_TOKEN="\$(cred-store.sh get cloudflare api_token)"
  eval "\$(cred-store.sh env openai)"
EOF
}

main() {
  local cmd="${1:-}"; shift || true
  case "$cmd" in
    init)  cmd_init "$@";;
    set)   cmd_set "$@";;
    get)   cmd_get "$@";;
    list)  cmd_list "$@";;
    env)   cmd_env "$@";;
    rm)    cmd_rm "$@";;
    edit)  cmd_edit "$@";;
    rekey) cmd_rekey "$@";;
    path)  printf '%s\n' "$STORE_FILE";;
    ""|-h|--help|help) usage;;
    *) err "unknown command: $cmd"; usage; exit 2;;
  esac
}

main "$@"
