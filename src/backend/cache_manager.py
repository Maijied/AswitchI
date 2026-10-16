import os
import json
import time
from pathlib import Path

CACHE_DIR = Path.home() / ".config" / "aswitchi" / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
CACHE_FILE = CACHE_DIR / "state_cache.json"

MAX_CACHE_AGE_SECONDS = 86400  # 24 hours

def load_cached_state():
    """
    Loads persistent cached state for instant sub-millisecond cold boot.
    Returns cached dict or None if missing/invalid/expired.
    """
    if not CACHE_FILE.exists():
        return None
    try:
        with open(CACHE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        timestamp = data.get("_timestamp", 0)
        # Check cache validity
        if time.time() - timestamp > MAX_CACHE_AGE_SECONDS:
            return None
        
        payload = data.get("payload")
        if payload and isinstance(payload, dict):
            return payload
    except Exception:
        pass
    return None

def save_cached_state(payload):
    """
    Atomically saves scanner and config state to persistent disk cache.
    """
    try:
        temp_file = CACHE_DIR / "state_cache.tmp"
        data = {
            "_timestamp": time.time(),
            "payload": payload
        }
        with open(temp_file, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
        temp_file.replace(CACHE_FILE)
        return True
    except Exception as e:
        print("Notice: could not save cache:", e)
        return False

def clear_cache():
    """Clears the persistent state cache."""
    try:
        if CACHE_FILE.exists():
            CACHE_FILE.unlink()
        return True
    except Exception:
        return False
