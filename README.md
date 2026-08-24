# AswitchI — macOS AI Switcher # AswitchI — macOS AI Switcher & Launchpad for Ubuntu Launchpad for Ubuntu

![CI/CD](https://github.com/Maijied/AswitchI/actions/workflows/main.yml/badge.svg)

<div align="center">
  <img src="assets/icon.svg" width="120" height="120" alt="AswitchI Logo" />
  <br />
  <strong>By Lorapok Labs</strong> (Founder: Maizied)
  <br /><br />
  <a href="#features"><img src="https://img.shields.io/badge/Platform-Ubuntu%20Linux-E95420?style=for-the-badge&logo=ubuntu&logoColor=white" alt="Ubuntu" /></a>
  <a href="#architecture"><img src="https://img.shields.io/badge/Architecture-GTK3%20%7C%20WebKit2-4F46E5?style=for-the-badge" alt="GTK3 WebKit2" /></a>
  <a href="#test-suite"><img src="https://img.shields.io/badge/Tests-26%2F26%20Passing%20(100%25)-10B981?style=for-the-badge" alt="Tests" /></a>
  <a href="#lorapok-labs"><img src="https://img.shields.io/badge/Developed%20By-Lorapok%20Labs-8B5CF6?style=for-the-badge" alt="Lorapok Labs" /></a>
</div>

---

## 🌟 Overview

**AswitchI** is an autonomous native AI Launchpad for Ubuntu Linux developed by **Lorapok Labs**. It bridges Desktop AI IDEs (Cursor, Kiro IDE, Claude Desktop, Devin, Windsurf, Antigravity), CLI AI agents (`agy`, `claude`, `cursor-agent`, `kiro-cli`, `devin`, `aider`), persistent in-app Web AIs (Claude, ChatGPT, Gemini, Perplexity, DeepSeek, v0, Grok), and 53+ local workspace repositories into a unified, fluid macOS Launchpad interface.

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

## 🚀 Quick Start

Launch **AswitchI** from anywhere:
```bash
aswitchi
```
Or use CLI arguments:
```bash
aswitchi --list     # Print all detected tools and running statuses
aswitchi --sync     # Perform an immediate system scan and refresh
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
python3 /mnt/NewVolume/Personal_Projects/AswitchI/tests/run_all_tests.py
```

---

## 🏢 About Lorapok Labs

* **Organization**: Lorapok Labs
* **Founder & Lead Architect**: Maizied
* **Mission**: Building next-generation AI orchestration tools, autonomous coding architectures, and native developer experiences.
* **Documentation**: See [`docs/`](docs/) directory for detailed guides.
