# AswitchI Official Wiki

Welcome to the official Wiki for **AswitchI**, the macOS-style AI Switcher and Launchpad built exclusively for Ubuntu/Linux. 

This document serves as a comprehensive guide to the architecture, features, and functionality of the AswitchI ecosystem.

---

## 🌟 Core Features & Functionality

### 1. The 3D Glass Dock
AswitchI brings a highly responsive, macOS-inspired dock to the Linux desktop.
* **Fluid Animations:** Built with WebKit2GTK and Framer Motion, the dock scales dynamically based on cursor proximity.
* **Persistent Web AIs:** By clicking on Claude, ChatGPT, or Gemini, AswitchI launches a sandbox browser session. Unlike a standard web browser, these sessions are persistent, isolated, and hardware-accelerated.
* **Intelligent App Pinning:** Automatically detects installed AI IDEs (Cursor, Windsurf) and pins them to your dock for instant access.

### 2. The Launchpad Matrix
A full-screen, grid-based application launcher designed to index all your local AI CLI agents and scripts.
* **Universal Search:** Press `Enter` or start typing to instantly filter your agents.
* **One-Click Execution:** Click any agent (like Cline, Aider, or Antigravity) to instantly spawn a new terminal window executing that specific environment.
* **Trackpad Native:** Swipe horizontally with two fingers to glide between pages of installed tools, mirroring native macOS workflows.

### 3. Mission Control (React Admin SPA)
A serverless React Dashboard (`aswitchi.lorapok.tech/admin/`) used by Lorapok Labs to manage AswitchI ecosystem deployments and operations.
* **Live CI/CD Auditing:** View the status of multi-architecture builds (amd64, arm64) directly from the dashboard.
* **Snap Release Gating:** Safely promote unreleased Snap revisions into the `stable`, `candidate`, or `edge` channels.
* **One-Click Rollbacks:** Quickly revert the live Snap Store version to a previous, safe baseline.
* **SEO & Analytics:** Monitor Google Search Console indices, organic traffic metrics, and keyword impressions natively within the dashboard.

---

## 🔐 Architecture & Deployment

AswitchI uses a modern, multi-language stack to bridge web technologies with native desktop performance.

### The Client (Ubuntu Desktop)
* **Language:** Python 3 (PyGObject)
* **Rendering Engine:** WebKit2GTK & GTK+3
* **Frontend Framework:** React 18, Vite, Framer Motion, TailwindCSS
* **Packaging:** Canonical Snapcraft (Strict confinement with dbus/network/desktop interfaces)

### The CI/CD Pipeline
* **GitHub Actions:** Orchestrates a complex 6-job matrix.
* **Quality Gate:** Enforces a 26-test PyUnit testing suite before compilation.
* **Multi-Arch Builds:** Compiles native Snap packages for both `amd64` (Intel/AMD) and `arm64` (Raspberry Pi/ARM).
* **Metadata Syncing:** Automatically extracts and pushes store listing details (Website, YouTube promos, issues, contact) to the Snap Store.

---

## ❓ Frequently Asked Questions

### Why does Mission Control require a GitHub PAT (Personal Access Token)?
Mission Control is built as a **serverless Static Single Page Application (SPA)** hosted on GitHub Pages. It has no backend server or database to store sensitive credentials securely.

Because the Admin Panel is designed to trigger highly privileged operations (like releasing new Snap updates or instantly rolling back production builds), it relies on the **GitHub API (`workflow_dispatch`)** to execute these actions via CI/CD.

To prove to the GitHub API that you are an authorized administrator, the browser must send a Personal Access Token (PAT). By asking you for the PAT directly in the UI, AswitchI ensures that your token is securely stored **only in your local browser memory** (sessionStorage), rather than being exposed or hardcoded in the public frontend code.

If you prefer not to use a PAT in the browser, you can always click the **"Copy CLI"** button to execute the deployment operation manually from your terminal using the Snapcraft CLI.

---

## 🤝 Contributing
Want to help build the future of Linux AI orchestration? 
Check out our [Contributing Guidelines](https://github.com/Maijied/AswitchI/blob/main/CONTRIBUTING.md) to get started with the development environment.
