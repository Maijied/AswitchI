# AswitchI — System Architecture Specification
**Author**: Lorapok Labs (Founder: Maizied)  
**Version**: v2.4.0 (macOS Edition)  
**Platform**: Ubuntu Linux / GTK3 / WebKit2GTK  

---

## 1. Executive Summary

**AswitchI** is an autonomous native AI Launchpad and switcher built specifically for Ubuntu Linux by **Lorapok Labs**. It bridges Desktop AI IDEs (Cursor, Kiro, Claude Desktop, Devin, Windsurf, Antigravity), CLI AI agents (`agy`, `claude`, `cursor-agent`, `kiro-cli`, `devin`, `aider`), persistent in-app Web AIs (Claude, ChatGPT, Gemini, Perplexity, DeepSeek, v0, Grok), and local workspace repositories into a unified macOS Launchpad experience.

---

## 2. High-Level Architectural Diagram

```mermaid
graph TD
    User([User Interaction]) --> GTK[Frameless GTK3 Window]
    
    subgraph "AswitchI Core Native Engine"
        GTK --> Stack[Gtk.Stack Transition Host]
        Stack --> LP[Launchpad View - WebKit2 UserContentManager]
        Stack --> InAppWeb[In-App Persistent WebKit2 Web AI View]
        
        LP <--> JSBridge[WebKit2 Script Message Bridge]
        JSBridge <--> PyBackend[Python 3 Native Controller]
    end

    subgraph "Backend Services (src/backend/)"
        PyBackend --> Scanner[Scanner Engine: Multi-Source & Process Tracking]
        PyBackend --> Executor[Executor Engine: Desktop / CLI / Web Spawn]
        PyBackend --> Config[Config Manager: Profile & Dock Pinning]
    end

    subgraph "Filesystem & System Integration"
        Scanner --> DesktopFiles[/usr/share/applications & ~/.local/share/applications]
        Scanner --> SnapFlatpak[/var/lib/snapd & /var/lib/flatpak]
        Scanner --> BinaryPaths[/snap/bin, ~/.cargo/bin, ~/.local/bin, ~/.nvm]
        Scanner --> Workspaces[~/Shohoz, ~/Desktop, /mnt/NewVolume/Personal_Projects]
        
        Config --> ProfileDir[~/.config/aswitchi/webai-profile]
        Config --> ConfigJson[~/.config/aswitchi/config.json]
        
        Executor --> GNOMETerminal[gnome-terminal PTY Session]
        Executor --> DesktopProcess[Native Executable Subprocess]
    end
```

---

## 3. Core Subsystems

### 3.1 Frameless GTK3 Window & WebKit2 Host (`aswitchi_native.py`)
- **Frameless Design**: Window decoration is stripped via `self.set_decorated(False)` with custom macOS traffic lights and control buttons (`–` Minimize, `×` Close).
- **Gtk.Stack Transitions**: Manages smooth crossfade animations between the Launchpad grid and in-app Web AI viewer.
- **Bi-Directional IPC Bridge**:
  - `nativeApp.postMessage(json)` dispatches JavaScript actions to Python.
  - `evaluate_javascript(...)` streams live process scans, workspace indexes, and dock state updates into the frontend without DOM reloads.

### 3.2 Persistent Web AI Engine (`WebKit2.WebsiteDataManager`)
- Operates a dedicated SQLite cookie and session database at `~/.config/aswitchi/webai-profile`.
- Bypasses iframe restrictions (`X-Frame-Options`, CSP frame-ancestors) via top-level WebKit2 rendering.
- Features native Mac top control bar (`‹ Launchpad`, `‹ › ⟳`, `↗ Standalone Pop-out`).

### 3.3 Deep Multi-Source Discovery Engine (`src/backend/scanner.py`)
- **Standard Desktop Applications**: Scans all 6 desktop registries.
- **CLI AI Agents**: Scans 13+ search paths (`$PATH`, NVM versions, Cargo, Snap, Gemini CLI).
- **Process Accuracy**: Line-by-line regex evaluation with global exclusion filters (`chrome-native-host`, `native-messaging`, `crashpad_handler`), preventing false positive running dots.
- **Workspace Discovery**: Recursively detects Git repositories, NPM packages, Composer projects, Rust crates, Flutter apps, and Go modules across target directories.

### 3.4 3D Glass Reflective Dock & Launchpad UI (`src/ui/`)
- **Strict 7-Column Grid**: Centered with safe margins, ensuring 14 items/page (2 rows × 7 columns) without edge clipping.
- **Authentic macOS Multi-Stage Bounce Physics**: Implements cubic-bezier vertical elasticity, peak stretching, and floor squash.
- **Frosted Glass Corner Badges**: Displays type tags (`🌐` Web, `>_` CLI, `⌘` Desktop, `📁` Projects) across grid and dock icons.
- **Interactive Help Modal**: Segmented modal featuring complete usage guides and **Lorapok Labs** developer information.

---

## 4. Security & Privacy
- **Encrypted Local Storage**: Web AI login sessions and authentication cookies are stored exclusively in the user's private home directory (`~/.config/aswitchi/webai-profile`).
- **No Telemetry**: 100% offline, local execution. No telemetry or external data collection.
