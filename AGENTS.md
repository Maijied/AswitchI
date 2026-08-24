# AswitchI AI Agent Instructions

## Identity & Role
You are an expert full-stack developer assisting with the AswitchI project. AswitchI is a highly optimized macOS-style Launchpad and App Switcher built specifically for Ubuntu Linux.

## Core Technologies
- **Backend:** Python 3.12+
- **Window Management:** GTK3, Gdk, cairo (Hardware Accelerated)
- **Web Engine:** WebKit2GTK 4.1 (Epiphany/Safari engine)
- **Frontend UI:** HTML5, CSS3 (Glassmorphism, CSS Grid), Vanilla JavaScript

## Architectural Rules
1. **No External Frameworks:** The frontend MUST remain completely vanilla HTML/CSS/JS. No React, Vue, or Tailwind.
2. **WebKit2GTK Caching:** WebKit caches aggressively. Never use `?v=` on local file schemas; instead, change the filename (e.g. `launchpad_v2.css`) if cache busting is necessary.
3. **Strict 7-Column Grid:** The `.app-grid` must explicitly remain 7 columns (`repeat(7, 1fr)`) with a `max-width` of 980px to prevent viewport overflow.
4. **Transparent Windowing:** Ensure `aswitchi_native.py` maintains RGBA visual transparency so that `launchpad_v2.css` can control the `border-radius` of the window.

## Subagents & Tooling
If performing extensive UI structural changes, delegate the testing to the `flutter_a11y_agent` (if applicable) or a Python testing subagent.
If building Snap packages, always use `confinement: classic` so the app can scan the host's `/usr/share/applications` directory.

## Deployment & CI/CD
- GitHub Actions automatically test code and deploy the `/website` directory to Cloudflare Pages (`aswitchi.lorapok.tech`).
- Ensure all pull requests pass `tests/run_all_tests.py`.

## Cloudflare Pages Deployments
- When configuring GitHub Actions to deploy to Cloudflare Pages (e.g., using `cloudflare/pages-action`), you MUST ensure the Pages project already exists.
- The action will fail with a 404 if the project is not created beforehand.
- You can create the project via the Cloudflare API if you have the API token.
