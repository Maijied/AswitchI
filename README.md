# AswitchI — macOS AI Switcher & Launchpad for Ubuntu Linux

<div align="center">
  <img src="assets/icon_animated.svg" width="130" height="130" alt="AswitchI Animated Logo" />
  <br />
  <strong>By Lorapok Labs</strong> (Founder & Architect: Maizied)
  <br /><br />
  [![Get it from the Snap Store](https://snapcraft.io/en/dark/install.svg)](https://snapcraft.io/aswitchi)
  [![aswitchi](https://snapcraft.io/aswitchi/badge.svg)](https://snapcraft.io/aswitchi)
  [![aswitchi](https://snapcraft.io/aswitchi/trending.svg?name=0)](https://snapcraft.io/aswitchi)
  <br /><br />
  <a href="https://aswitchi.lorapok.tech"><img src="https://img.shields.io/badge/Website-aswitchi.lorapok.tech-00F2FE?style=for-the-badge&logo=googlechrome&logoColor=black" alt="Website" /></a>
  <a href="#features"><img src="https://img.shields.io/badge/Platform-Ubuntu%20%7C%20Debian%20%7C%20Arch-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" /></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-GTK3%20%7C%20WebKit2-4F46E5?style=for-the-badge" alt="GTK3 WebKit2" /></a>
  <a href="#test-suite"><img src="https://img.shields.io/badge/Tests-26%2F26%20Passing%20(100%25)-10B981?style=for-the-badge" alt="Tests" /></a>
  <a href="#lorapok-labs"><img src="https://img.shields.io/badge/Developed%20By-Lorapok%20Labs-8B5CF6?style=for-the-badge" alt="Lorapok Labs" /></a>
</div>

---

## 🏷️ Snap Tags & Keywords
`snap` • `snapcraft` • `snap-store` • `ubuntu` • `linux-desktop` • `launchpad` • `ai-dock` • `ai-switcher` • `cursor-ide` • `windsurf` • `claude` • `chatgpt` • `gemini` • `aider` • `cline` • `webkit2gtk` • `lorapok-labs`

---

## 🌟 Overview

**AswitchI** is an autonomous native AI Launchpad for Linux developed by **Lorapok Labs**. It bridges Desktop AI IDEs (Cursor, Kiro IDE, Claude Desktop, Devin, Windsurf, Antigravity), CLI AI agents (`agy`, `claude`, `cursor-agent`, `kiro-cli`, `devin`, `aider`), persistent in-app Web AIs (Claude, ChatGPT, Gemini, Perplexity, DeepSeek, v0, Grok), and 53+ local workspace repositories into a unified, fluid macOS Launchpad interface.

---

## 📦 Snap Store Installation (Recommended)

Install **AswitchI** on Ubuntu, Debian, Fedora, Arch Linux, or Manjaro with a single command:

```bash
sudo snap install aswitchi
```

To install with classic confinement (allowing full IDE and CLI tool discovery across host paths):
```bash
sudo snap install aswitchi --classic
```

---

## ✨ Features

- 🍎 **Authentic macOS Launchpad & 3D Glass Dock**: Frosted glass reflections, Apple SF Pro typography, and multi-stage elastic bounce physics on launch.
- 🚀 **Zero-Login In-App Web AIs**: Web AIs run directly inside AswitchI with encrypted SQLite cookie and session persistence (`~/.config/aswitchi/webai-profile`).
- ⚡ **Strict 7-Column Grid Containment**: Exactly 14 items per page (2 rows × 7 columns) centered with safe side margins to eliminate edge clipping.
- 🟢 **100% Precise Process Tracking**: Line-by-line regex token matcher with exclusion filters for browser extensions and background helpers (zero false positive dots).
- 🏷️ **Frosted Glass Type Badges**: Distinguishes Web AIs (`🌐`), CLI Agents (`>_`), Desktop IDEs (`⌘`), and Workspace Projects (`📁`).
- 📂 **Workspace Project Picker**: Right-click any IDE to open directly into indexed projects across `~/Shohoz`, `~/Desktop`, or `/mnt/NewVolume/Personal_Projects`.
- 📌 **Persistent Dock Pinning**: Right-click any tool to pin or unpin from the 3D Dock.
- ⌨️ **Trackpad Gestures & Shortcuts**: 2-finger horizontal swipe for page navigation, `Esc` to return, and `Enter` for instant search execution.
- 🏢 **Lorapok Labs Info & Help Modal**: Click the floating `?` icon to view complete user instructions and developer background.

---

## 🚀 Quick Start & CLI Flags

Launch **AswitchI** from anywhere:
```bash
aswitchi
```
Or use CLI arguments:
```bash
aswitchi --status    # Check GTK3 runtime and detected AI workspace statuses
aswitchi --list      # Print all detected tools, CLI agents, and Web AIs
aswitchi --sync      # Perform an immediate system scan and refresh
aswitchi --launch claude   # Spawn an isolated sandboxed Web AI session
```

---

## 🏗️ Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full architectural breakdown.

```mermaid
graph TD
    A[GTK3 Frameless Window] --> B[Gtk.Stack Transition Host]
    B --> C[Launchpad View - WebKit2 UserContentManager]
    B --> D[In-App Persistent Web AI View - WebKit2]
    C <--> E[Python 3 Native Controller]
    E --> F[Multi-Source Discovery Scanner]
    E --> G[Process Executor Engine]
    E --> H[Config & Profile Manager]
```

---

## 🧪 Test Suite

Run the comprehensive 26-test suite:
```bash
python3 tests/run_all_tests.py
```

---

## 🏢 About Lorapok Labs

* **Organization**: Lorapok Labs
* **Founder & Lead Architect**: Maizied
* **Live Product Website**: [https://aswitchi.lorapok.tech](https://aswitchi.lorapok.tech)
* **Canonical Snap Store**: [https://snapcraft.io/aswitchi](https://snapcraft.io/aswitchi)
* **Mission**: Building next-generation AI orchestration tools, autonomous coding architectures, and native developer experiences.
