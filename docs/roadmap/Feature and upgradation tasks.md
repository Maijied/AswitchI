# AswitchI: Future Features & Upgradation Tasks

This document outlines strategic suggestions, roadmap items, and feature upgrades to take AswitchI to the next level of AI Engineering hubs on Linux.

## 1. Deep System Integration (Linux Native)
- **Wayland / X11 Compositor Hooks**: Allow the 3D Dock to interact natively with window managers for live-preview thumbnails and alt-tab style switching between Web AI profiles.
- **Hardware Telemetry Dashboard**: Add a system monitor to the Mission Control panel that tracks RAM, CPU, and GPU usage specifically consumed by active AI agents and Chrome-based Web AI instances.
- **D-Bus Orchestration**: Allow AswitchI CLI agents to natively control system settings (e.g., "Agent, switch to dark mode" or "Agent, mute notifications while I code").

## 2. Local LLM & Edge Inference
- **Ollama / vLLM Native Support**: Provide a seamless "1-click install" for local LLMs directly into the AswitchI ecosystem. Let the AswitchI Launchpad spin up local inference servers for complete privacy.
- **Agent Memory Vault**: Implement a local RAG (Retrieval-Augmented Generation) vector database (like Chroma or Milvus) so that Web AIs can remember past projects and context permanently.

## 3. Multi-Agent Orchestration 
- **Agent-to-Agent Communication**: A protocol allowing different AIs to collaborate. For example, a "Research Agent" passing data directly to a "Code Writing Agent".
- **Visual Workflow Builder**: A drag-and-drop UI in the Admin Panel to chain together CLI agents and Web AIs into automated pipelines (e.g., CI/CD trigger -> Review Agent -> Notification Agent).

## 4. Cloud & Synchronization
- **AswitchI Sync**: Secure, end-to-end encrypted syncing of `aswitchi.json`, pinned dock items, and Web AI profiles across multiple Linux machines using a Firebase backend.
- **Plugin & Agent Marketplace**: A community hub within the app where engineers can publish and download custom Web AI configurations, custom icons, and Python CLI scripts.

## 5. UI/UX & Quality of Life
- **Customizable Themes**: Expand the Cyber UI to include other developer-centric themes (e.g., Dracula, Nord, Monokai).
- **Keyboard-First Navigation**: Implement a global shortcut (e.g., `Super + Space`) similar to macOS Spotlight or Linux rofi/krunner to instantly search and launch any AswitchI agent without using the mouse.
- **Interactive Terminal Emulator**: Embed a fully functional terminal directly inside the Mission Control Admin Panel for managing Docker/Snap deployments without leaving the browser.

## 6. Security & Sandboxing
- **Web AI Isolation**: Enhance the Chrome App isolation by running Web AIs in strict Linux namespaces or Flatpak/Snap sandbox modes, preventing them from accessing local files unless explicitly permitted via the Admin Panel.
- **Audit Logs**: Maintain a detailed ledger of all commands executed by CLI agents and Web AIs for maximum security tracing.

---
*Generated as part of the AswitchI Future Planning Initiative.*
