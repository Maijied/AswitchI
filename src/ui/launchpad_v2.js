// AswitchI Native Launchpad Controller

let state = {
  desktopApps: [],
  cliAgents: [],
  webAis: [],
  projects: [],
  dockItemIds: [],
  activeCategory: 'all',
  currentPage: 0,
  pageCount: 1,
  searchQuery: '',
  selectedAppForContext: null,
  selectedAiForProj: null,
  isSwiping: false,
  launchingAppId: null,
  initialLoaded: false
};

const ITEMS_PER_PAGE = 14; // Strictly 2 rows of 7 columns

const ICON_FILES = {
  aswitchi: 'icons/aswitchi.svg',
  cursor: 'icons/cursor.png',
  dcursor: 'icons/dcursor.png',
  kiro: 'icons/kiro.png',
  claude: 'icons/claude.png',
  chatgpt: 'icons/chatgpt.png',
  devin: 'icons/devin.png',
  gemini: 'icons/gemini.svg',
  perplexity: 'icons/perplexity.svg',
  deepseek: 'icons/deepseek.svg',
  v0: 'icons/v0.svg',
  grok: 'icons/grok.svg',
  huggingface: 'icons/huggingface.svg',
  antigravity: 'icons/antigravity.svg',
  windsurf: 'icons/windsurf.svg',
  whatsapp: 'icons/whatsapp.svg',
  teams: 'icons/teams.svg',
  folder: 'icons/folder.svg',
  trash: 'icons/trash.svg',
  terminal: 'icons/terminal.svg',
  lorapok: 'icons/lorapok.svg',
  globe: 'icons/folder.svg'
};

function getIconSrc(key) {
  return ICON_FILES[key] || 'icons/folder.svg';
}

function showToast(text) {
  const toast = document.getElementById('toast');
  toast.innerText = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function callNative(action, payload = {}) {
  const data = JSON.stringify({ action, ...payload });
  if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.nativeApp) {
    window.webkit.messageHandlers.nativeApp.postMessage(data);
  } else {
    console.log('Native call:', action, payload);
  }
}

window.onNativeDataReceived = function(rawJson) {
  try {
    const data = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
    state.desktopApps = data.desktopApps || [];
    state.cliAgents = data.cliAgents || [];
    state.webAis = data.webAis || [];
    state.projects = data.projects || [];
    state.dockItemIds = data.dockItemIds || [];
    state.appVersion = data.appVersion || "1.0.0";
    const verBadge = document.getElementById("about-version");
    if (verBadge) verBadge.innerText = "v" + state.appVersion;
    
    if (!state.updateChecked) {
      state.updateChecked = true;
      checkForUpdates(state.appVersion);
    }

    // Stop bounce loading animation if running process updated
    state.launchingAppId = null;

    updateCategoryCounts();
    renderPages();
    renderDock();

    // Dismiss opening splash loader
    if (!state.initialLoaded) {
      state.initialLoaded = true;
      setTimeout(() => {
        const splash = document.getElementById('launchpad-splash');
        if (splash) {
          splash.classList.add('fade-out');
          setTimeout(() => { splash.style.display = 'none'; }, 320);
        }
      }, 350);
    }
  } catch (err) {
    console.error('Error parsing native data:', err);
  }
};

function updateCategoryCounts() {
  document.getElementById('count-all').innerText = state.desktopApps.length + state.cliAgents.length + state.webAis.length;
  document.getElementById('count-desktop').innerText = state.desktopApps.length;
  document.getElementById('count-cli').innerText = state.cliAgents.length;
  document.getElementById('count-web').innerText = state.webAis.length;
  document.getElementById('count-projects').innerText = state.projects.length;
}

function getAllApps() {
  return [
    ...state.desktopApps,
    ...state.cliAgents,
    ...state.webAis
  ];
}

function getFilteredApps() {
  let items = [];
  if (state.activeCategory === 'all') {
    items = getAllApps();
  } else if (state.activeCategory === 'desktop') {
    items = state.desktopApps;
  } else if (state.activeCategory === 'cli') {
    items = state.cliAgents;
  } else if (state.activeCategory === 'web') {
    items = state.webAis;
  } else if (state.activeCategory === 'projects') {
    items = state.projects.map(p => ({
      id: `proj-${p.name}`,
      name: p.name,
      description: p.path,
      type: 'project',
      category: 'project',
      icon: 'folder',
      projectPath: p.path
    }));
  }

  const q = state.searchQuery.toLowerCase().trim();
  if (!q) return items;

  // Fuzzy match sequence logic
  function fuzzyMatch(query, text) {
    if (!text) return -1;
    text = text.toLowerCase();
    
    if (text.includes(query)) {
      if (text.startsWith(query)) return 100; // Prefix match bonus
      return 50; // Substring match bonus
    }

    let qIdx = 0;
    let tIdx = 0;
    let matchCount = 0;
    
    while (qIdx < query.length && tIdx < text.length) {
      if (query[qIdx] === text[tIdx]) {
        matchCount++;
        qIdx++;
      }
      tIdx++;
    }
    
    if (qIdx === query.length) {
      return 10 + matchCount; // Sequence match
    }
    return -1; 
  }

  const scoredItems = items.map(a => {
    let bestScore = -1;
    const targets = [a.name, a.cmd, a.url, a.description, a.projectPath];
    for (const t of targets) {
      const s = fuzzyMatch(q, t);
      if (s > bestScore) bestScore = s;
    }
    return { item: a, score: bestScore };
  });

  return scoredItems
    .filter(x => x.score > -1)
    .sort((a, b) => b.score - a.score)
    .map(x => x.item);
}

function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function renderPages() {
  const slider = document.getElementById('pages-slider');
  const dotsContainer = document.getElementById('pagination-dots');
  slider.innerHTML = '';
  dotsContainer.innerHTML = '';

  const items = getFilteredApps();
  const pages = chunkArray(items, ITEMS_PER_PAGE);
  state.pageCount = Math.max(pages.length, 1);

  if (state.currentPage >= state.pageCount) {
    state.currentPage = state.pageCount - 1;
  }

  slider.style.width = `${state.pageCount * 100}%`;

  if (pages.length === 0) {
    const pageView = document.createElement('div');
    pageView.className = 'page-view';
    pageView.style.width = `${100 / state.pageCount}%`;
    pageView.innerHTML = `<div style="color:#94a3b8; font-size:14px; margin:auto;">No applications found in this category.</div>`;
    slider.appendChild(pageView);
  } else {
    pages.forEach((pageItems, pageIdx) => {
      const pageView = document.createElement('div');
      pageView.className = 'page-view';
      pageView.style.width = `${100 / state.pageCount}%`;

      const grid = document.createElement('div');
      grid.className = 'app-grid';

      pageItems.forEach(app => {
        grid.appendChild(createAppElement(app));
      });

      pageView.appendChild(grid);
      slider.appendChild(pageView);
    });
  }

  // Render pagination dots
  if (state.pageCount > 1) {
    dotsContainer.style.display = 'flex';
    for (let i = 0; i < state.pageCount; i++) {
      const dot = document.createElement('span');
      dot.className = `dot ${i === state.currentPage ? 'active' : ''}`;
      dot.onclick = () => goToPage(i);
      dotsContainer.appendChild(dot);
    }
  } else {
    dotsContainer.style.display = 'none';
  }

  goToPage(state.currentPage);
}

function createAppElement(app) {
  const item = document.createElement('div');
  item.className = 'app-item';
  item.title = `${app.name} (${app.type ? app.type.toUpperCase() : 'APP'})`;

  const iconSrc = getIconSrc(app.icon);
  
  // Running indicator dot ONLY if app is actively running
  const runningDot = app.running ? `<div class="running-indicator-dot"></div>` : '';
  const badge = app.badge ? `<div class="app-badge">${app.badge}</div>` : '';

  // Sleek Frosted Corner Mini Badge
  let cornerBadge = '';
  if (app.type === 'web') {
    cornerBadge = `<div class="corner-badge badge-web" title="Web AI">🌐</div>`;
  } else if (app.type === 'cli') {
    cornerBadge = `<div class="corner-badge badge-cli" title="CLI Agent">>_</div>`;
  } else if (app.type === 'desktop') {
    cornerBadge = `<div class="corner-badge badge-desktop" title="Desktop IDE">⌘</div>`;
  } else if (app.type === 'project') {
    cornerBadge = `<div class="corner-badge badge-project" title="Workspace Project">📁</div>`;
  }

  const isLaunching = state.launchingAppId === app.id ? 'launching' : '';

  item.innerHTML = `
    <div class="icon-box ${isLaunching}" id="icon-box-${app.id}">
      ${cornerBadge}
      <img src="${iconSrc}" alt="${app.name}" draggable="false" />
      ${badge}
      ${runningDot}
    </div>
    <span class="app-label">${app.name}</span>
  `;

  item.onclick = (e) => {
    triggerAppLaunch(app, item.querySelector('.icon-box'));
  };

  item.oncontextmenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(e, app);
  };

  return item;
}

function renderDock() {
  const dock = document.getElementById('dock-shelf');
  dock.innerHTML = '';

  const allApps = getAllApps();
  const dockIds = state.dockItemIds.length > 0 ? state.dockItemIds : ['desktop-cursor', 'desktop-kiro', 'desktop-claude', 'desktop-chatgpt', 'web-claude', 'web-gemini', 'cli-agy'];

  dockIds.forEach(id => {
    const app = allApps.find(a => a.id === id);
    if (!app) return;

    const iconSrc = getIconSrc(app.icon);
    const dot = app.running ? `<div class="dock-dot"></div>` : '';

    // Dock corner badge
    let cornerBadge = '';
    if (app.type === 'web') {
      cornerBadge = `<div class="dock-corner-badge badge-web" title="Web AI">🌐</div>`;
    } else if (app.type === 'cli') {
      cornerBadge = `<div class="dock-corner-badge badge-cli" title="CLI Agent">>_</div>`;
    } else if (app.type === 'desktop') {
      cornerBadge = `<div class="dock-corner-badge badge-desktop" title="Desktop IDE">⌘</div>`;
    }

    const isLaunching = state.launchingAppId === app.id ? 'launching' : '';

    const el = document.createElement('div');
    el.className = 'dock-item';
    el.title = app.name;
    el.innerHTML = `
      <div class="dock-icon-box ${isLaunching}" id="dock-box-${app.id}">
        ${cornerBadge}
        <img src="${iconSrc}" alt="${app.name}" draggable="false" />
      </div>
      ${dot}
    `;
    el.onclick = () => triggerAppLaunch(app, el.querySelector('.dock-icon-box'));
    el.oncontextmenu = (e) => {
      e.preventDefault();
      openContextMenu(e, app);
    };
    dock.appendChild(el);
  });

  const div = document.createElement('div');
  div.className = 'dock-divider';
  dock.appendChild(div);

  // Projects Folder in Dock
  const folderEl = document.createElement('div');
  folderEl.className = 'dock-item';
  folderEl.title = 'Projects Workspace Explorer';
  folderEl.innerHTML = `
    <div class="dock-icon-box">
      <div class="dock-corner-badge badge-project" title="Projects">📁</div>
      <img src="icons/folder.svg" alt="Projects" draggable="false" />
    </div>
  `;
  folderEl.onclick = () => {
    const ide = state.desktopApps.find(a => a.id === 'desktop-cursor') || state.desktopApps[0];
    openProjectModal(ide);
  };
  dock.appendChild(folderEl);

  // Trash in Dock
  const trashEl = document.createElement('div');
  trashEl.className = 'dock-item';
  trashEl.title = 'Trash';
  trashEl.innerHTML = `
    <div class="dock-icon-box">
      <img src="icons/trash.svg" alt="Trash" draggable="false" />
    </div>
  `;
  trashEl.onclick = () => {
    callNative('openTrash');
    showToast('Opened Trash');
  };
  dock.appendChild(trashEl);
}

function goToPage(pageIndex) {
  if (pageIndex < 0) pageIndex = 0;
  if (pageIndex >= state.pageCount) pageIndex = state.pageCount - 1;
  state.currentPage = pageIndex;

  const slider = document.getElementById('pages-slider');
  const shiftPct = pageIndex * (100 / state.pageCount);
  slider.style.transform = `translateX(-${shiftPct}%)`;

  const dots = document.querySelectorAll('#pagination-dots .dot');
  dots.forEach((d, idx) => {
    if (idx === pageIndex) d.classList.add('active');
    else d.classList.remove('active');
  });
}

function triggerAppLaunch(app, iconBoxEl = null) {
  state.launchingAppId = app.id;

  // Authentic macOS Elastic Bouncing Loader
  if (iconBoxEl) {
    iconBoxEl.classList.add('launching');
    setTimeout(() => {
      iconBoxEl.classList.remove('launching');
      state.launchingAppId = null;
    }, 1800);
  }

  launchApp(app);
}

function launchApp(app, projectPath = null) {
  if (app.type === 'web' || app.url) {
    showToast(`Opening ${app.name} inside AswitchI...`);
    callNative('openInAppWeb', { item: app });
    return;
  }

  if (app.type === 'project') {
    const ide = state.desktopApps.find(a => a.id === 'desktop-cursor') || state.desktopApps[0];
    showToast(`Opening ${app.name} in ${ide ? ide.name : 'IDE'}...`);
    callNative('launch', { type: 'desktop', item: ide, projectPath: app.projectPath });
    return;
  }

  showToast(`Opening ${app.name}...`);
  callNative('launch', { type: app.type || 'desktop', item: app, projectPath });
}

// Right-Click Context Menu Logic
function openContextMenu(e, app) {
  state.selectedAppForContext = app;
  const menu = document.getElementById('context-menu');

  const isPinned = state.dockItemIds.includes(app.id);
  document.getElementById('ctx-dock-icon').innerText = isPinned ? '❌' : '📌';
  document.getElementById('ctx-dock-text').innerText = isPinned ? 'Remove from Dock' : 'Pin to Dock';

  const projBtn = document.getElementById('ctx-project');
  projBtn.style.display = app.type === 'desktop' ? 'flex' : 'none';

  const stopBtn = document.getElementById('ctx-stop');
  const stopDiv = document.getElementById('ctx-stop-divider');
  if (app.running) {
    stopBtn.style.display = 'flex';
    stopDiv.style.display = 'block';
  } else {
    stopBtn.style.display = 'none';
    stopDiv.style.display = 'none';
  }

  const menuWidth = 200;
  const menuHeight = 150;
  let x = e.clientX;
  let y = e.clientY;

  if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
  if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;

  menu.style.left = `${x}px`;
  menu.style.top = `${y}px`;
  menu.classList.remove('hidden');
}

function closeContextMenu() {
  document.getElementById('context-menu').classList.add('hidden');
}

function openProjectModal(aiItem) {
  state.selectedAiForProj = aiItem;
  const modal = document.getElementById('modal-project');
  document.getElementById('proj-modal-title').innerText = `Open Workspace in ${aiItem.name}`;
  renderProjectsList(state.projects);
  modal.classList.remove('hidden');
}

function renderProjectsList(projects) {
  const container = document.getElementById('projects-list');
  container.innerHTML = '';

  projects.forEach(proj => {
    const row = document.createElement('div');
    row.className = 'proj-row';
    row.innerHTML = `
      <div>
        <div style="font-weight:600; font-size:13px; color:#fff;">${proj.name}</div>
        <div style="font-size:11px; color:#94a3b8; font-family:monospace;">${proj.path}</div>
      </div>
      <button style="padding:4px 10px; background:#4f46e5; border:none; border-radius:6px; color:#fff; font-size:11px; font-weight:600; cursor:pointer;">Select</button>
    `;
    row.onclick = () => {
      document.getElementById('modal-project').classList.add('hidden');
      launchApp(state.selectedAiForProj, proj.path);
    };
    container.appendChild(row);
  });
}

function setupEvents() {
  // Category Pills
  document.querySelectorAll('.cat-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.cat;
      state.currentPage = 0;
      renderPages();
    });
  });

  // 2-Finger Horizontal Scroll Swipe Detection
  window.addEventListener('wheel', (e) => {
    if (state.isSwiping) return;

    if (Math.abs(e.deltaX) > 22 && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      if (e.deltaX > 22 && state.currentPage < state.pageCount - 1) {
        state.isSwiping = true;
        goToPage(state.currentPage + 1);
        setTimeout(() => { state.isSwiping = false; }, 380);
      } else if (e.deltaX < -22 && state.currentPage > 0) {
        state.isSwiping = true;
        goToPage(state.currentPage - 1);
        setTimeout(() => { state.isSwiping = false; }, 380);
      }
    }
  }, { passive: true });

  // Search input
  const search = document.getElementById('search-input');
  search.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    state.currentPage = 0;
    renderPages();
  });

  // Window Controls: Minimize & Close
  document.getElementById('btn-minimize').addEventListener('click', () => {
    callNative('minimizeWindow');
  });

  document.getElementById('btn-close').addEventListener('click', () => {
    callNative('closeWindow');
  });

  // Floating Help Button & Tabs
  const modalHelp = document.getElementById('modal-help');
  const tabGuide = document.getElementById('tab-guide');
  const tabAbout = document.getElementById('tab-about');
  const bodyGuide = document.getElementById('modal-body-guide');
  const bodyAbout = document.getElementById('modal-body-about');

  document.getElementById('btn-help').addEventListener('click', () => {
    modalHelp.classList.remove('hidden');
  });
  document.getElementById('help-close-red').addEventListener('click', () => {
    modalHelp.classList.add('hidden');
  });

  tabGuide.addEventListener('click', () => {
    tabGuide.classList.add('active');
    tabAbout.classList.remove('active');
    bodyGuide.classList.remove('hidden');
    bodyAbout.classList.add('hidden');
  });

  tabAbout.addEventListener('click', () => {
    tabAbout.classList.add('active');
    tabGuide.classList.remove('active');
    bodyAbout.classList.remove('hidden');
    bodyGuide.classList.add('hidden');
  });

  // Context Menu Actions
  document.getElementById('ctx-launch').addEventListener('click', () => {
    if (state.selectedAppForContext) launchApp(state.selectedAppForContext);
    closeContextMenu();
  });

  document.getElementById('ctx-project').addEventListener('click', () => {
    if (state.selectedAppForContext) openProjectModal(state.selectedAppForContext);
    closeContextMenu();
  });

  document.getElementById('ctx-dock').addEventListener('click', () => {
    if (state.selectedAppForContext) {
      callNative('togglePinDock', { id: state.selectedAppForContext.id });
      const isPinned = state.dockItemIds.includes(state.selectedAppForContext.id);
      showToast(isPinned ? `Removed from Dock` : `Pinned to Dock`);
    }
    closeContextMenu();
  });

  document.getElementById('ctx-stop').addEventListener('click', () => {
    if (state.selectedAppForContext) {
      callNative('stopApp', { keyword: state.selectedAppForContext.name.toLowerCase() });
      showToast(`Stopped ${state.selectedAppForContext.name}`);
    }
    closeContextMenu();
  });

  window.addEventListener('click', () => {
    closeContextMenu();
  });

  // Sync button
  const btnSync = document.getElementById('btn-sync');
  btnSync.addEventListener('click', () => {
    const svg = btnSync.querySelector('.sync-svg');
    svg.classList.add('spinning');
    callNative('sync');
    showToast('Syncing all installed AIs & projects...');
    setTimeout(() => svg.classList.remove('spinning'), 1200);
  });

  // Add Web AI Modal
  const modalWeb = document.getElementById('modal-web-ai');
  document.getElementById('btn-add-web').addEventListener('click', () => {
    modalWeb.classList.remove('hidden');
    document.getElementById('web-name').focus();
  });
  document.getElementById('modal-close-red').addEventListener('click', () => modalWeb.classList.add('hidden'));
  document.getElementById('modal-cancel').addEventListener('click', () => modalWeb.classList.add('hidden'));

  document.getElementById('form-web-ai').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('web-name').value;
    const url = document.getElementById('web-url').value;
    const desc = document.getElementById('web-desc').value;

    callNative('addWebAi', { name, url, description: desc });
    modalWeb.classList.add('hidden');
    document.getElementById('form-web-ai').reset();
    showToast(`Added ${name} to Launchpad!`);
  });

  // Project Modal
  document.getElementById('proj-close-red').addEventListener('click', () => {
    document.getElementById('modal-project').classList.add('hidden');
  });
  document.getElementById('proj-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = state.projects.filter(p => p.name.toLowerCase().includes(q) || p.path.toLowerCase().includes(q));
    renderProjectsList(filtered);
  });

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!modalHelp.classList.contains('hidden')) {
        modalHelp.classList.add('hidden');
        return;
      }
      if (!modalWeb.classList.contains('hidden')) {
        modalWeb.classList.add('hidden');
        return;
      }
      const projModal = document.getElementById('modal-project');
      if (!projModal.classList.contains('hidden')) {
        projModal.classList.add('hidden');
        return;
      }
      if (search.value) {
        search.value = '';
        state.searchQuery = '';
        renderPages();
      } else {
        callNative('closeWindow');
      }
    }

    if (e.key === 'ArrowRight' && document.activeElement !== search) {
      goToPage(state.currentPage + 1);
    }
    if (e.key === 'ArrowLeft' && document.activeElement !== search) {
      goToPage(state.currentPage - 1);
    }

    if (e.key === 'Enter' && document.activeElement === search) {
      const filtered = getFilteredApps();
      if (filtered.length > 0) {
        triggerAppLaunch(filtered[0]);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  callNative('sync');
});

async function checkForUpdates(currentVersion) {
  try {
    const res = await fetch('https://api.github.com/repos/Maijied/AswitchI/releases/latest');
    if (res.ok) {
      const release = await res.json();
      const latestVersion = release.tag_name.replace('v', '');
      if (latestVersion && latestVersion !== currentVersion && latestVersion.localeCompare(currentVersion, undefined, { numeric: true, sensitivity: 'base' }) > 0) {
        showUpdateNotification(latestVersion);
      }
    }
  } catch (err) {
    console.error("Update check failed", err);
  }
}

function showUpdateNotification(version) {
  const existing = document.getElementById('update-toast');
  if (existing) existing.remove();
  
  const toast = document.createElement('div');
  toast.id = 'update-toast';
  toast.className = 'toast-notification update-toast';
  toast.innerHTML = `
    <div class="toast-content">
      <span class="update-icon">🚀</span>
      <span>AswitchI <b>v${version}</b> is available!</span>
    </div>
    <div class="toast-actions">
      <button class="glass-btn btn-small" onclick="window.open('https://aswitchi.lorapok.tech')">Download</button>
      <button class="glass-btn btn-small btn-secondary" onclick="this.parentElement.parentElement.remove()">Later</button>
    </div>
  `;
  document.body.appendChild(toast);
}
