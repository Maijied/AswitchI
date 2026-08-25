import subprocess
import shutil
import os
from pathlib import Path
from .config import get_config

CONFIG_DIR = Path.home() / ".config" / "aswitchi"
WEBAI_PROFILE_DIR = CONFIG_DIR / "webai-profile"

def launch_desktop(app, project_path=None):
    exec_cmd = app.get("exec", "")
    args = exec_cmd.split()
    if project_path:
        args.append(project_path)
    
    try:
        subprocess.Popen(args, start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"success": True, "message": f"Launched {app.get('name')}"}
    except Exception as e:
        return {"success": False, "error": str(e)}

def launch_cli(agent, project_path=None):
    cwd = project_path or str(Path.home())
    cmd_str = agent.get("cmd", "")
    name = agent.get("name", "AI Agent")
    script = f"cd '{cwd}' && echo -e '\\e[1;34m==> Launching {name}...\\e[0m\\n' && {cmd_str}; exec bash"
    
    term_args = ["gnome-terminal", "--title", name, "--", "bash", "-c", script]
    try:
        subprocess.Popen(term_args, start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"success": True, "message": f"Started {name} in terminal"}
    except Exception as e:
        try:
            subprocess.Popen(["x-terminal-emulator", "-e", f"bash -c \"{script}\""], start_new_session=True)
            return {"success": True, "message": f"Started {name} in terminal"}
        except Exception as e2:
            return {"success": False, "error": str(e2)}

def launch_web(web_ai):
    url = web_ai.get("url") or "https://aswitchi.lorapok.tech"
    name = web_ai.get("name", "AswitchI Web AI")
    app_id = web_ai.get("id", "web")
    app_class = f"aswitchi-{app_id}"
    
    WEBAI_PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    
    # Locate Chrome / Chromium binary
    chrome_bin = (
        shutil.which("google-chrome")
        or shutil.which("google-chrome-stable")
        or "/opt/google/chrome/google-chrome"
        or shutil.which("chromium")
        or shutil.which("chromium-browser")
        or shutil.which("brave-browser")
    )
    
    args = [
        chrome_bin,
        f"--user-data-dir={WEBAI_PROFILE_DIR}",
        f"--app={url}",
        f"--class={app_class}",
        "--window-size=1280,860",
        "--enable-features=WebUIDarkMode",
        "--force-dark-mode"
    ]
    
    try:
        subprocess.Popen(args, start_new_session=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"success": True, "message": f"Opened {name} as Standalone App (Encrypted Profile Saved)"}
    except Exception as e:
        try:
            subprocess.Popen(["xdg-open", url], start_new_session=True)
            return {"success": True, "message": f"Opened {name} in default browser"}
        except Exception as e2:
            return {"success": False, "error": str(e2)}

def stop_process(keyword):
    try:
        subprocess.run(["pkill", "-f", keyword], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return {"success": True, "message": f"Stopped {keyword}"}
    except Exception as e:
        return {"success": False, "error": str(e)}
