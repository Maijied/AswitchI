import os
import re
import urllib.request
import urllib.parse
from pathlib import Path

ICONS_CACHE_DIR = Path.home() / ".config" / "aswitchi" / "icons"
ICONS_CACHE_DIR.mkdir(parents=True, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"

def sanitize_filename(name):
    clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', name)
    return clean.strip('_') or "webai"

def get_cached_icon_path(icon_id):
    if not icon_id:
        return None
    clean = sanitize_filename(icon_id)
    for ext in [".png", ".svg", ".ico", ".jpg", ".webp"]:
        target = ICONS_CACHE_DIR / f"{clean}{ext}"
        if target.exists() and target.stat().st_size > 0:
            return str(target)
    return None

def fetch_and_cache_icon(url, icon_id=None):
    """
    Auto-fetches high-resolution website icon or author AI icon.
    Downloads and caches locally in ~/.config/aswitchi/icons/<icon_id>.png.
    Returns the local path or None if failed.
    """
    if not url:
        return None
    
    try:
        parsed = urllib.parse.urlparse(url)
        domain = parsed.netloc or parsed.path
        domain = domain.split(":")[0]  # Strip port if any
        if not domain:
            return None
    except Exception:
        return None

    if not icon_id:
        icon_id = sanitize_filename(domain)
    else:
        icon_id = sanitize_filename(icon_id)

    # Check if already cached
    cached = get_cached_icon_path(icon_id)
    if cached:
        return cached

    # Candidate icon service URLs (Priority: High-res Google Favicon API -> DuckDuckGo -> Direct /favicon.ico)
    candidates = [
        f"https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://{domain}&size=128",
        f"https://www.google.com/s2/favicons?domain={domain}&sz=128",
        f"https://icons.duckduckgo.com/ip3/{domain}.ico",
        f"https://{domain}/apple-touch-icon.png",
        f"https://{domain}/favicon.ico"
    ]

    target_file = ICONS_CACHE_DIR / f"{icon_id}.png"

    for candidate_url in candidates:
        try:
            req = urllib.request.Request(
                candidate_url,
                headers={"User-Agent": USER_AGENT}
            )
            with urllib.request.urlopen(req, timeout=4) as response:
                content_type = response.headers.get("Content-Type", "").lower()
                data = response.read()

                # Verify valid image content (greater than 100 bytes and not an HTML error page)
                if len(data) > 100 and not data.startswith(b"<!DOCTYPE") and not data.startswith(b"<html"):
                    # Check extension
                    if "svg" in content_type:
                        save_target = ICONS_CACHE_DIR / f"{icon_id}.svg"
                    elif "ico" in content_type:
                        save_target = ICONS_CACHE_DIR / f"{icon_id}.ico"
                    else:
                        save_target = target_file

                    with open(save_target, "wb") as f:
                        f.write(data)
                    return str(save_target)
        except Exception:
            continue

    return None

def fetch_author_ai_icon(author_name_or_url):
    """
    Fetches avatar or branding icon for author or AI creator portfolio.
    """
    if "http://" in author_name_or_url or "https://" in author_name_or_url:
        return fetch_and_cache_icon(author_name_or_url)
    
    # Try GitHub avatar if author handle given
    handle = sanitize_filename(author_name_or_url)
    github_url = f"https://github.com/{handle}.png?size=128"
    return fetch_and_cache_icon(github_url, f"author_{handle}")
