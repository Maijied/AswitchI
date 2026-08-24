# AswitchI — User & Operator Guide
**Product of Lorapok Labs** (Founder: Maizied)  
**Version**: v2.4.0 (macOS Edition)  

---

## 1. Quick Start

Launch **AswitchI** via any of the following methods:
* **Terminal**: `aswitchi` (or `aswitchi --list` / `aswitchi --sync`)
* **Ubuntu Application Menu**: Search for `AswitchI`
* **Desktop Shortcut**: Double-click `AswitchI` on your Desktop

---

## 2. Core Features & Controls

### 2.1 Launching Tools & Apps
- **Single Left Click**: Launches any Desktop AI IDE, CLI Agent, or Web AI.
- **macOS Bouncing Animation**: The clicked icon bounces elastically until process startup completes.
- **Live Status Dots**:
  - `🟢` Green dot in the grid indicates an actively running IDE or agent.
  - `⚪` White dot in the 3D Dock indicates an actively running docked app.

### 2.2 In-App Persistent Web AIs
- Clicking **Claude**, **ChatGPT**, **Gemini**, **Perplexity**, **DeepSeek**, **v0**, or **Grok** opens the tool directly inside AswitchI.
- Credentials and logins are stored securely in `~/.config/aswitchi/webai-profile` (no need to log in repeatedly).
- Press `Esc` or click `‹ Launchpad` in the top bar to return to the grid.
- Click `↗ Standalone` to pop the Web AI into a dedicated standalone window.

### 2.3 Opening Projects in AI IDEs
- **Right Click** any Desktop IDE in the grid (e.g. Cursor, Kiro IDE, Claude Desktop).
- Click **📂 Open Project in AI...** to choose from your 53+ indexed workspace repositories.

### 2.4 Managing the 3D Glass Dock
- **Pin to Dock**: Right-click any app in the Launchpad and select **📌 Pin to Dock**.
- **Remove from Dock**: Right-click any docked app and select **❌ Remove from Dock**.
- Pinned state is permanently saved to `~/.config/aswitchi/config.json`.

---

## 3. Gestures & Keyboard Shortcuts

| Shortcut / Gesture | Action |
| :--- | :--- |
| `2-Finger Horizontal Swipe` | Seamlessly slide between Launchpad pages |
| `←` / `→` Arrow Keys | Previous / Next page |
| `Esc` | Close modal / Return to Launchpad from Web AI / Exit |
| `Enter` | Immediately launch first matched search result |
| `?` (Bottom Right) | Open Guide & Lorapok Labs Information Modal |
| `–` (Top Right) | Minimize window to Ubuntu Dock |
| `×` (Top Right) | Close window |
