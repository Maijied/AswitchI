import os
import json
from pathlib import Path

CONFIG_DIR = Path.home() / ".config" / "aswitchi"
CONFIG_FILE = CONFIG_DIR / "config.json"
WEBAI_PROFILE_DIR = CONFIG_DIR / "webai-profile"

DEFAULT_WEB_AIS = [
    {
        "id": "web-claude",
        "name": "Claude Web",
        "url": "https://claude.ai",
        "description": "Anthropic Claude 3.5 Sonnet & Opus interactive workspace",
        "category": "web",
        "type": "web",
        "icon": "claude",
        "color": "#D97706"
    },
    {
        "id": "web-chatgpt",
        "name": "ChatGPT Web",
        "url": "https://chatgpt.com",
        "description": "OpenAI ChatGPT 4o, Canvas, and Advanced Voice",
        "category": "web",
        "type": "web",
        "icon": "chatgpt",
        "color": "#10B981"
    },
    {
        "id": "web-gemini",
        "name": "Google Gemini",
        "url": "https://gemini.google.com",
        "description": "Google Gemini 1.5 Pro & Deep Research",
        "category": "web",
        "type": "web",
        "icon": "gemini",
        "color": "#3B82F6"
    },
    {
        "id": "web-aistudio",
        "name": "Google AI Studio",
        "url": "https://aistudio.google.com",
        "description": "Gemini 2.0 / Flash / Pro Developer Playground",
        "category": "web",
        "type": "web",
        "icon": "gemini",
        "color": "#6366F1"
    },
    {
        "id": "web-perplexity",
        "name": "Perplexity AI",
        "url": "https://www.perplexity.ai",
        "description": "Real-time AI search, research engine & reasoning models",
        "category": "web",
        "type": "web",
        "icon": "perplexity",
        "color": "#06B6D4"
    },
    {
        "id": "web-deepseek",
        "name": "DeepSeek Chat",
        "url": "https://chat.deepseek.com",
        "description": "DeepSeek V3 & R1 Reasoning Engine",
        "category": "web",
        "type": "web",
        "icon": "deepseek",
        "color": "#4F46E5"
    },
    {
        "id": "web-v0",
        "name": "v0 by Vercel",
        "url": "https://v0.dev",
        "description": "Generative UI development with React, Tailwind & Next.js",
        "category": "web",
        "type": "web",
        "icon": "v0",
        "color": "#000000"
    },
    {
        "id": "web-grok",
        "name": "Grok (xAI)",
        "url": "https://grok.com",
        "description": "xAI Grok conversational and vision model",
        "category": "web",
        "type": "web",
        "icon": "grok",
        "color": "#64748B"
    },
    {
        "id": "web-hf",
        "name": "HuggingChat",
        "url": "https://huggingface.co/chat",
        "description": "Open source AI models (Llama 3, Qwen, Mistral) by Hugging Face",
        "category": "web",
        "type": "web",
        "icon": "huggingface",
        "color": "#F59E0B"
    }
]

def ensure_config():
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    WEBAI_PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    if not CONFIG_FILE.exists():
        initial = {
            "customWebAis": [],
            "dockItemIds": [
                "desktop-cursor",
                "desktop-kiro",
                "desktop-claude",
                "desktop-chatgpt",
                "web-claude",
                "web-gemini",
                "cli-agy"
            ],
            "customWorkspacePaths": [
                str(Path.home() / "Documents"),
                str(Path.home() / "Projects"),
                str(Path.home() / "Desktop")
            ],
            "saveWebAiSessions": True,
            "theme": "macos-navy"
        }
        with open(CONFIG_FILE, "w") as f:
            json.dump(initial, f, indent=2)
        return initial
    try:
        with open(CONFIG_FILE, "r") as f:
            data = json.load(f)
            if "dockItemIds" not in data:
                data["dockItemIds"] = ["desktop-cursor", "desktop-kiro", "desktop-claude", "desktop-chatgpt", "web-claude", "web-gemini", "cli-agy"]
            if "saveWebAiSessions" not in data:
                data["saveWebAiSessions"] = True
            return data
    except Exception:
        return {}

def get_config():
    return ensure_config()

def save_config(updates):
    current = ensure_config()
    current.update(updates)
    with open(CONFIG_FILE, "w") as f:
        json.dump(current, f, indent=2)
    return current

def get_all_web_ais():
    cfg = get_config()
    custom = cfg.get("customWebAis", [])
    all_web = []
    for item in DEFAULT_WEB_AIS + custom:
        item["type"] = "web"
        all_web.append(item)
    return all_web

def add_custom_web_ai(entry):
    cfg = get_config()
    custom = cfg.get("customWebAis", [])
    new_id = f"custom-web-{int(os.times().system * 1000)}"
    item = {
        "id": new_id,
        "name": entry.get("name", "").strip(),
        "url": entry.get("url", "").strip(),
        "description": entry.get("description", "Custom Web AI"),
        "category": "web",
        "type": "web",
        "icon": entry.get("icon", "globe"),
        "color": entry.get("color", "#3B82F6"),
        "custom": True
    }
    custom.append(item)
    cfg["customWebAis"] = custom
    save_config(cfg)
    return item

def remove_custom_web_ai(item_id):
    cfg = get_config()
    custom = [x for x in cfg.get("customWebAis", []) if x.get("id") != item_id]
    cfg["customWebAis"] = custom
    save_config(cfg)
    return custom

def toggle_pin_dock(item_id):
    cfg = get_config()
    dock_ids = cfg.get("dockItemIds", [])
    if item_id in dock_ids:
        dock_ids.remove(item_id)
        is_pinned = False
    else:
        dock_ids.append(item_id)
        is_pinned = True
    cfg["dockItemIds"] = dock_ids
    save_config(cfg)
    return {"dockItemIds": dock_ids, "isPinned": is_pinned}

def get_app_version():
    try:
        ver_file = Path(__file__).parent.parent.parent / "version.json"
        with open(ver_file, "r") as f:
            return json.load(f).get("version", "1.0.0")
    except Exception:
        return "1.0.0"
