# AswitchI — Developer & Contributor Guide
**Lorapok Labs Engineering Documentation**  
**Lead Architect**: Maizied (Founder, Lorapok Labs)  

---

## 1. Project Organization

```
/mnt/NewVolume/Personal_Projects/AswitchI/
├── aswitchi_native.py        # Frameless GTK3/WebKit2 Application Entrypoint
├── bin/
│   └── aswitchi              # CLI Wrapper & Automated Desktop Integrator
├── assets/
│   └── icon.svg              # High-Resolution Official SVG Vector Icon
├── src/
│   ├── backend/
│   │   ├── config.py         # Persistent Settings & Profile Manager
│   │   ├── scanner.py        # Multi-Source Discovery & Regex Process Matcher
│   │   └── executor.py       # Process Spawner (Desktop, CLI, Web)
│   └── ui/
│       ├── launchpad.html    # Launchpad Markup, Modals & Splash Screen
│       ├── launchpad.css     # Apple SF Pro Layout, 7-Column Grid, Dock & Bounce
│       ├── launchpad.js      # Frontend State Controller & Native Bridge
│       └── icons/            # 20 Official SVG/PNG Brand Icons
├── scripts/
│   └── install-desktop.sh    # Desktop Entry & App Menu Installer
├── tests/
│   ├── run_all_tests.py      # Unified Automated Test Runner (26 Tests)
│   ├── test_scanner.py       # Scanner & Regex Exclusion Tests
│   ├── test_config.py        # Config & Dock Persistence Tests
│   ├── test_executor.py      # Process Spawning Tests
│   ├── test_ui_assets.py     # UI Assets & CSS Integrity Tests
│   └── test_desktop_integration.py # Desktop Integration & CLI Tests
└── docs/
    ├── ARCHITECTURE.md       # Full System Architecture Specification
    ├── USAGE_GUIDE.md        # User Manual & Keyboard Shortcuts
    └── DEVELOPER_GUIDE.md    # Developer & Contribution Guide
```

---

## 2. Running Automated Tests

AswitchI includes an automated test suite verifying all layers:

```bash
python3 /mnt/NewVolume/Personal_Projects/AswitchI/tests/run_all_tests.py
```

### Test Coverage:
- **`test_scanner.py`**: Validates multi-registry discovery, process regex isolation, and workspace scanning.
- **`test_config.py`**: Validates dock pin toggling, custom Web AI registry, and profile directory creation.
- **`test_executor.py`**: Validates desktop executable launching, terminal CLI execution, and process stopping.
- **`test_ui_assets.py`**: Asserts all 20 icons exist, HTML structure validity, CSS rules, and strict 14-item chunking.
- **`test_desktop_integration.py`**: Validates `.desktop` entries, CLI flags (`--list`, `--sync`), and GTK window instantiation.

---

## 3. Adding New Desktop AI or CLI Agent

To register a new AI tool, edit `KNOWN_DESKTOP_PATTERNS` or `KNOWN_CLI_AGENTS` in [`src/backend/scanner.py`](file:///mnt/NewVolume/Personal_Projects/AswitchI/src/backend/scanner.py):

```python
{
    "id": "desktop-myapp",
    "name": "My AI App",
    "match": [r"(^|\s|/)myapp(\s|$)"],
    "exclude": GLOBAL_PROCESS_EXCLUDES,
    "category": "ide",
    "icon": "myapp",
    "color": "#6366F1"
}
```
