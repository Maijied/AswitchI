# AswitchI: Snap Store Publication & Improvement Plan

This plan addresses the requirements for publishing AswitchI to the Snap Store, ensuring complete cross-Linux compatibility, and implementing a superior, standard search mechanism. 

## 1. Snap Store Confinement Strategy

AswitchI inherently acts as a system utility: it scans the host OS for applications, reads system configuration paths, queries the running process tree (`ps -eo args`), kills processes (`pkill`), and launches external host binaries (`gnome-terminal`, `google-chrome`).

**The Problem**: Strict confinement (the default Snap mode) severely isolates the application via AppArmor and cgroups. 
- `ps -eo args` will only see AswitchI's own processes.
- Launching `/usr/bin/google-chrome` or `gnome-terminal` will fail.
- Reading `/usr/share/applications` will only read the snap's isolated filesystem, missing all host desktop entries.

**The Solution**: We must package AswitchI as a **Classic Snap**. 
Classic confinement provides the snap with the same host system access as a traditionally packaged application (like an `.rpm` or `.deb`). Since AswitchI is an application launcher and system scanner, it perfectly fits the criteria for classic confinement according to Snap Store guidelines.

### Task 1.1: Create `snapcraft.yaml`
- We will create a `snapcraft.yaml` file at the project root.
- It will define `confinement: classic`.
- It will use the `gnome` extension for proper GTK3 and WebKit2GTK library bundling.
- We will create a wrapper script to set up Python and `PYTHONPATH` correctly within the snap.

## 2. Cross-Linux Path Normalization

Currently, `config.py` and `scanner.py` use hardcoded paths that might exist on your machine (like `/mnt/NewVolume/Personal_Projects` or `~/Shohoz`), but will fail or be meaningless on other users' machines.

### Task 2.1: Dynamic Workspace Discovery
- **Action**: Update `config.py` to use standard XDG directories (`XDG_DOCUMENTS_DIR`, `XDG_DESKTOP_DIR`) via `GLib.get_user_special_dir` or `os.path.expanduser`.
- **Action**: Change the default fallback list to `["~/Documents", "~/Projects", "~/Desktop"]` instead of hardcoded absolute paths.

### Task 2.2: Standard Desktop File Scanning
- **Action**: Update `scanner.py` to respect the `XDG_DATA_DIRS` environment variable. By default on most distros, this points to `/usr/share` and `/usr/local/share`, but on NixOS or Flatpak environments, it varies.
- **Action**: We will read `XDG_DATA_DIRS` and append `/applications` to each path, ensuring we find all `.desktop` files regardless of the Linux distribution architecture.

## 3. Search Mechanism Upgrade

The current search mechanism (`a.name.toLowerCase().includes(q)`) is functional but rudimentary. To make it a "standard and much better" scanner (like macOS Spotlight or Albert), it needs fuzzy matching and relevance scoring.

### Task 3.1: Implement Fuzzy Search in `launchpad.js`
- **Action**: Replace the simple `.includes()` with a Levenshtein distance algorithm or a sequential character matching algorithm (e.g., typing "cpt" will match "chatgpt").
- **Action**: Add relevance scoring:
  - Exact prefix matches score highest.
  - Substring matches score medium.
  - Fuzzy subsequence matches score lower.
- **Action**: Sort the search results by this score rather than their default grid order, ensuring the most relevant app is always first (and automatically selected if the user presses Enter).

## 4. UI Polish & Loader 
- **Action**: Verify the loading overlay cleanly hides *only* after `window.onNativeDataReceived` processes the first JSON payload from Python. (Currently implemented, but we will add a 300ms CSS fade transition to make it feel smoother like macOS).
- **Action**: Ensure the Lorapok Labs and Maizied developer information inside the Help `?` menu is properly styled.

---

### Step-by-Step Execution Checklist
- [ ] 1. Update `config.py` default workspace paths to standard generic Linux paths.
- [ ] 2. Update `scanner.py` to utilize `XDG_DATA_DIRS` for cross-distro `.desktop` file parsing.
- [ ] 3. Refactor `launchpad.js` search function to use a fuzzy sequence matcher and score-based sorting.
- [ ] 4. Add CSS fade-out transitions to the loading splash screen.
- [ ] 5. Generate `snapcraft.yaml` with `confinement: classic` and required GTK/WebKit2 dependencies.
