import os
import re
import glob
import subprocess
from pathlib import Path
from .config import get_all_web_ais, get_config

GLOBAL_PROCESS_EXCLUDES = [
    r"chrome-native-host",
    r"native-messaging",
    r"chrome-extension://",
    r"crashpad_handler",
    r"/usr/bin/grep",
    r"ps -eo"
]

def get_desktop_dirs():
    dirs = [Path.home() / ".local/share/applications"]
    xdg_data_dirs = os.environ.get("XDG_DATA_DIRS", "/usr/share:/usr/local/share")
    for d in xdg_data_dirs.split(":"):
        if d.strip():
            dirs.append(Path(d.strip()) / "applications")
    # Always include Snap and Flatpak standard paths in case they aren't in XDG_DATA_DIRS
    dirs.extend([
        Path("/var/lib/snapd/desktop/applications"),
        Path("/var/lib/flatpak/exports/share/applications"),
        Path.home() / ".local/share/flatpak/exports/share/applications"
    ])
    # Deduplicate while preserving order
    return list(dict.fromkeys(dirs))

# Standard desktop directories to inspect
DESKTOP_DIRS = get_desktop_dirs()

# Comprehensive Known AI Registry
KNOWN_DESKTOP_PATTERNS = [
    {
        "id": "desktop-cursor",
        "name": "Cursor",
        "keywords": ["cursor"],
        "match": [r"(^|\s|/)cursor(\s|$)", r"/usr/share/cursor/cursor\b"],
        "exclude": [r"dcursor", r"cursor-agent"] + GLOBAL_PROCESS_EXCLUDES,
        "category": "ide",
        "icon": "cursor",
        "color": "#6366F1"
    },
    {
        "id": "desktop-dcursor",
        "name": "dCursor",
        "keywords": ["dcursor"],
        "match": [r"(^|\s|/)dcursor-gui\b", r"/usr/share/dcursor/"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "ide",
        "icon": "dcursor",
        "color": "#8B5CF6"
    },
    {
        "id": "desktop-kiro",
        "name": "Kiro IDE",
        "keywords": ["kiro"],
        "match": [r"/kiro-ide/kiro\b", r"(^|\s|/)kiro(\s|$)"],
        "exclude": [r"kiro-cli", r"kirocrew"] + GLOBAL_PROCESS_EXCLUDES,
        "category": "ide",
        "icon": "kiro",
        "color": "#EC4899"
    },
    {
        "id": "desktop-claude",
        "name": "Claude Desktop",
        "keywords": ["claude"],
        "match": [r"(^|\s|/)claude-desktop(\s|$)"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "desktop-ai",
        "icon": "claude",
        "color": "#D97706"
    },
    {
        "id": "desktop-chatgpt",
        "name": "ChatGPT Desktop",
        "keywords": ["chatgpt"],
        "match": [r"(^|\s|/)chatgpt(\s|$)", r"(^|\s|/)chatgpt-desktop\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "desktop-ai",
        "icon": "chatgpt",
        "color": "#10B981"
    },
    {
        "id": "desktop-devin",
        "name": "Devin Desktop",
        "keywords": ["devin"],
        "match": [r"(^|\s|/)devin-desktop\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "ide",
        "icon": "devin",
        "color": "#06B6D4"
    },
    {
        "id": "desktop-windsurf",
        "name": "Windsurf IDE",
        "keywords": ["windsurf"],
        "match": [r"(^|\s|/)windsurf(\s|$)"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "ide",
        "icon": "windsurf",
        "color": "#3B82F6"
    },
    {
        "id": "desktop-antigravity",
        "name": "Antigravity IDE",
        "keywords": ["antigravity"],
        "match": [r"/antigravity/antigravity\b", r"(^|\s|/)antigravity-ide\b"],
        "exclude": [r"\bagy\b"] + GLOBAL_PROCESS_EXCLUDES,
        "category": "ide",
        "icon": "antigravity",
        "color": "#EF4444"
    },
    {
        "id": "desktop-ollama",
        "name": "Ollama",
        "keywords": ["ollama"],
        "match": [r"\bollama\s+serve\b", r"\bollama\s+app\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "desktop-ai",
        "icon": "terminal",
        "color": "#10B981"
    },
    {
        "id": "desktop-lmstudio",
        "name": "LM Studio",
        "keywords": ["lm-studio", "lmstudio"],
        "match": [r"lm-studio", r"lmstudio"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "desktop-ai",
        "icon": "terminal",
        "color": "#6366F1"
    },
    {
        "id": "desktop-jan",
        "name": "Jan AI",
        "keywords": ["jan", "jan-ai"],
        "match": [r"\bjan\b", r"jan-ai"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "category": "desktop-ai",
        "icon": "terminal",
        "color": "#8B5CF6"
    }
]

KNOWN_CLI_AGENTS = [
    {
        "id": "cli-agy",
        "name": "Antigravity CLI",
        "cmd": "agy",
        "match": [r"(^|\s|/)agy(\s|$)"],
        "exclude": [r"antigravity-ide"] + GLOBAL_PROCESS_EXCLUDES,
        "description": "Google DeepMind Antigravity Autonomous Coding Agent",
        "icon": "antigravity",
        "color": "#EF4444"
    },
    {
        "id": "cli-cursor-agent",
        "name": "Cursor Agent",
        "cmd": "cursor-agent",
        "match": [r"(^|\s|/)cursor-agent\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "Cursor Headless Coding Agent CLI",
        "icon": "cursor",
        "color": "#6366F1"
    },
    {
        "id": "cli-dcursor-agent",
        "name": "dCursor Agent",
        "cmd": "dcursor-agent",
        "match": [r"(^|\s|/)dcursor-agent\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "dCursor Isolated Coding Agent CLI",
        "icon": "dcursor",
        "color": "#8B5CF6"
    },
    {
        "id": "cli-claude",
        "name": "Claude Code CLI",
        "cmd": "claude",
        "match": [r"/bin/claude\b", r"node.*claude(\s|$)"],
        "exclude": [r"claude-desktop"] + GLOBAL_PROCESS_EXCLUDES,
        "description": "Anthropic Claude Code CLI Assistant",
        "icon": "claude",
        "color": "#D97706"
    },
    {
        "id": "cli-kiro",
        "name": "Kiro CLI",
        "cmd": "kiro-cli",
        "match": [r"(^|\s|/)kiro-cli\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "Kiro Spec-Driven Coding Agent CLI",
        "icon": "kiro",
        "color": "#EC4899"
    },
    {
        "id": "cli-devin",
        "name": "Devin CLI",
        "cmd": "devin",
        "match": [r"/bin/devin\b", r"(^|\s|/)devin(\s|$)"],
        "exclude": [r"devin-desktop"] + GLOBAL_PROCESS_EXCLUDES,
        "description": "Devin AI Software Engineer CLI",
        "icon": "devin",
        "color": "#06B6D4"
    },
    {
        "id": "cli-aider",
        "name": "Aider AI",
        "cmd": "aider",
        "match": [r"(^|\s|/)aider(\s|$)"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "AI Pair Programming in your Terminal",
        "icon": "terminal",
        "color": "#3B82F6"
    },
    {
        "id": "cli-ollama",
        "name": "Ollama CLI",
        "cmd": "ollama",
        "match": [r"\bollama\s+run\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "Run Llama 3, Qwen, Mistral Locally",
        "icon": "terminal",
        "color": "#10B981"
    },
    {
        "id": "cli-gpt-engineer",
        "name": "GPT Engineer",
        "cmd": "gpt-engineer",
        "match": [r"gpt-engineer"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "Specify what you want built, AI delivers code",
        "icon": "terminal",
        "color": "#6366F1"
    },
    {
        "id": "cli-open-interpreter",
        "name": "Open Interpreter",
        "cmd": "interpreter",
        "match": [r"open-interpreter", r"\binterpreter\b"],
        "exclude": GLOBAL_PROCESS_EXCLUDES,
        "description": "Open-source, locally executing code interpreter",
        "icon": "terminal",
        "color": "#8B5CF6"
    }
]

def get_running_process_output():
    try:
        res = subprocess.check_output(["ps", "-eo", "args"], stderr=subprocess.DEVNULL)
        return res.decode("utf-8", "ignore")
    except Exception:
        return ""

def is_pattern_running(patterns, proc_text, excludes=None):
    if not proc_text:
        return False
    excludes = (excludes or []) + GLOBAL_PROCESS_EXCLUDES
    for line in proc_text.splitlines():
        if any(re.search(ex, line, re.IGNORECASE) for ex in excludes):
            continue
        if any(re.search(pat, line, re.IGNORECASE) for pat in patterns):
            return True
    return False

def scan_desktop_applications(proc_text):
    found = {}

    for d in DESKTOP_DIRS:
        if not d.exists():
            continue
        for f in d.glob("*.desktop"):
            try:
                content = f.read_text(encoding="utf-8", errors="ignore")
                name = ""
                exec_cmd = ""
                icon_val = ""
                no_display = False
                for line in content.splitlines():
                    if line.startswith("Name=") and not name:
                        name = line.split("=", 1)[1].strip()
                    elif line.startswith("Exec=") and not exec_cmd:
                        exec_cmd = line.split("=", 1)[1].strip()
                    elif line.startswith("Icon=") and not icon_val:
                        icon_val = line.split("=", 1)[1].strip()
                    elif line.startswith("NoDisplay=true"):
                        no_display = True
                
                if no_display or not name or not exec_cmd:
                    continue

                lower_name = name.lower()
                lower_file = f.name.lower()
                lower_exec = exec_cmd.lower()

                for pat in KNOWN_DESKTOP_PATTERNS:
                    if pat["id"] == "desktop-cursor" and ("dcursor" in lower_name or "dcursor" in lower_file or "dcursor" in lower_exec):
                        continue
                    if pat["id"] == "desktop-claude" and ("claude code" in lower_name):
                        continue

                    matches = any(re.search(p, lower_name) or re.search(p, lower_file) or re.search(p, lower_exec) for p in pat["match"])
                    if matches and "url handler" not in lower_name and "bridge" not in lower_name:
                        is_running = is_pattern_running(pat["match"], proc_text, pat.get("exclude"))
                        clean_exec = exec_cmd.split("%")[0].strip()
                        found[pat["id"]] = {
                            "id": pat["id"],
                            "name": pat["name"],
                            "category": pat["category"],
                            "exec": clean_exec,
                            "desktopFile": str(f),
                            "icon": pat["icon"],
                            "color": pat["color"],
                            "running": is_running,
                            "installed": True,
                            "type": "desktop"
                        }
            except Exception:
                pass

    # Check manual paths if desktop entry missing
    if "desktop-kiro" not in found and (Path.home() / ".local/bin/kiro").exists():
        found["desktop-kiro"] = {
            "id": "desktop-kiro",
            "name": "Kiro IDE",
            "category": "ide",
            "exec": str(Path.home() / ".local/share/kiro-ide/kiro"),
            "icon": "kiro",
            "color": "#EC4899",
            "running": is_pattern_running([r"/kiro-ide/kiro\b", r"(^|\s|/)kiro(\s|$)"], proc_text, [r"kiro-cli", r"kirocrew"] + GLOBAL_PROCESS_EXCLUDES),
            "installed": True,
            "type": "desktop"
        }

    # Scan AppImages across multiple user locations
    appimage_dirs = [
        Path.home() / "Downloads",
        Path.home() / "Applications",
        Path.home() / "Desktop",
        Path("/opt")
    ]
    for d in appimage_dirs:
        if d.exists():
            for f in d.glob("*.AppImage"):
                lower_f = f.name.lower()
                if "kiro" in lower_f and "desktop-kirocrew" not in found:
                    found["desktop-kirocrew"] = {
                        "id": "desktop-kirocrew",
                        "name": "KiroCrew AppImage",
                        "category": "desktop-ai",
                        "exec": str(f),
                        "icon": "kiro",
                        "color": "#EC4899",
                        "running": is_pattern_running([r"kirocrew"], proc_text, GLOBAL_PROCESS_EXCLUDES),
                        "installed": True,
                        "type": "desktop"
                    }
                elif "cursor" in lower_f and "desktop-cursor" not in found:
                    found["desktop-cursor-appimage"] = {
                        "id": "desktop-cursor-appimage",
                        "name": "Cursor AppImage",
                        "category": "ide",
                        "exec": str(f),
                        "icon": "cursor",
                        "color": "#6366F1",
                        "running": is_pattern_running([r"(^|\s|/)cursor(\s|$)"], proc_text, GLOBAL_PROCESS_EXCLUDES),
                        "installed": True,
                        "type": "desktop"
                    }

    return list(found.values())

def scan_cli_agents(proc_text):
    path_dirs = os.environ.get("PATH", "").split(":")
    extra_dirs = [
        str(Path.home() / ".local/bin"),
        str(Path.home() / ".cargo/bin"),
        str(Path.home() / ".gemini/antigravity-cli/bin"),
        "/snap/bin"
    ] + glob.glob(str(Path.home() / ".nvm/versions/node/*/bin"))

    all_dirs = list(set([d for d in path_dirs + extra_dirs if os.path.exists(d)]))
    found = []

    for agent in KNOWN_CLI_AGENTS:
        binary_path = None
        for p in all_dirs:
            full = Path(p) / agent["cmd"]
            if full.exists() and os.access(full, os.X_OK):
                binary_path = str(full)
                break
        
        if binary_path:
            is_running = is_pattern_running(agent["match"], proc_text, agent.get("exclude"))
            found.append({
                "id": agent["id"],
                "name": agent["name"],
                "cmd": agent["cmd"],
                "binaryPath": binary_path,
                "description": agent["description"],
                "category": "cli",
                "icon": agent["icon"],
                "color": agent["color"],
                "running": is_running,
                "installed": True,
                "type": "cli"
            })

    return found

def scan_projects():
    cfg = get_config()
    roots = cfg.get("customWorkspacePaths", [
        str(Path.home() / "Documents"),
        str(Path.home() / "Projects"),
        str(Path.home() / "Desktop")
    ])
    indicators = [".git", "package.json", "composer.json", "requirements.txt", "Cargo.toml", "pubspec.yaml", "go.mod"]
    projects = []

    def explore(directory, depth=0):
        if depth > 2:
            return
        d = Path(directory)
        if not d.exists() or not d.is_dir():
            return
        try:
            for item in d.iterdir():
                if not item.is_dir() or item.name.startswith(".") or item.name in ["node_modules", "vendor", "dist", "build", "cache"]:
                    continue
                try:
                    has_indicator = any((item / ind).exists() for ind in indicators)
                    if has_indicator:
                        projects.append({
                            "name": item.name,
                            "path": str(item),
                            "parent": d.name,
                            "lastModified": item.stat().st_mtime
                        })
                    else:
                        explore(item, depth + 1)
                except Exception:
                    pass
        except Exception:
            pass

    for r in roots:
        explore(r, 0)

    projects.sort(key=lambda x: x["lastModified"], reverse=True)
    return projects

def scan_all():
    cfg = get_config()
    proc = get_running_process_output()
    desktop = scan_desktop_applications(proc)
    cli = scan_cli_agents(proc)
    web = get_all_web_ais()
    projects = scan_projects()
    dock_ids = cfg.get("dockItemIds", [])

    return {
        "desktopApps": desktop,
        "cliAgents": cli,
        "webAis": web,
        "projects": projects,
        "dockItemIds": dock_ids,
        "summary": {
            "totalInstalledAIs": len(desktop) + len(cli),
            "desktopCount": len(desktop),
            "cliCount": len(cli),
            "webCount": len(web),
            "projectCount": len(projects)
        }
    }
