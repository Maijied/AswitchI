// AswitchI - Frontend Controller

let appState = {
  desktopApps: [],
  cliAgents: [],
  webAis: [],
  projects: [],
  activeCategory: 'all',
  searchQuery: '',
  selectedProjectForAi: null
};

// SVG Icons Dictionary
const ICONS = {
  cursor: `<svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path stroke-linecap="round" stroke-linejoin="round" d="M13 13l6 6"/></svg>`,
  kiro: `<svg class="w-5 h-5 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  claude: `<svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  chatgpt: `<svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`,
  devin: `<svg class="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  windsurf: `<svg class="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
  antigravity: `<svg class="w-5 h-5 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  gemini: `<svg class="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  perplexity: `<svg class="w-5 h-5 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  deepseek: `<svg class="w-5 h-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/></svg>`,
  v0: `<svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 22 22 2 22"/></svg>`,
  globe: `<svg class="w-5 h-5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  folder: `<svg class="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  cli: `<svg class="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`
};

function getIcon(name) {
  return ICONS[name] || ICONS.globe;
}

function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  toast.innerText = msg;
  toast.style.opacity = '1';
  setTimeout(() => {
    toast.style.opacity = '0';
  }, 2500);
}

// Fetch scan data
async function loadData() {
  const btnSync = document.getElementById('btn-sync');
  const syncIcon = btnSync.querySelector('.sync-icon');
  syncIcon.classList.add('syncing');

  try {
    const res = await fetch('/api/scan');
    const json = await res.json();
    if (json.success) {
      appState.desktopApps = json.data.desktopApps || [];
      appState.cliAgents = json.data.cliAgents || [];
      appState.webAis = json.data.webAis || [];
      appState.projects = json.data.projects || [];
      
      updateCounts();
      renderGrid();
      showToast('Detected ' + json.data.summary.totalInstalledAIs + ' AI tools & ' + json.data.summary.projectCount + ' projects');
      document.getElementById('last-scanned').innerText = 'Synced at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  } catch (err) {
    showToast('Scan error: ' + err.message);
  } finally {
    syncIcon.classList.remove('syncing');
  }
}

function updateCounts() {
  const total = appState.desktopApps.length + appState.cliAgents.length + appState.webAis.length;
  document.getElementById('count-all').innerText = total;
  document.getElementById('count-ide').innerText = appState.desktopApps.length;
  document.getElementById('count-cli').innerText = appState.cliAgents.length;
  document.getElementById('count-web').innerText = appState.webAis.length;
  document.getElementById('count-projects').innerText = appState.projects.length;

  const running = [...appState.desktopApps, ...appState.cliAgents].filter(a => a.running).length;
  document.getElementById('running-count').innerText = `${running} Running`;
}

function getFilteredItems() {
  let list = [];
  const cat = appState.activeCategory;

  if (cat === 'all') {
    list = [...appState.desktopApps, ...appState.cliAgents, ...appState.webAis];
  } else if (cat === 'ide') {
    list = [...appState.desktopApps];
  } else if (cat === 'cli') {
    list = [...appState.cliAgents];
  } else if (cat === 'web') {
    list = [...appState.webAis];
  } else if (cat === 'projects') {
    list = appState.projects.map(p => ({
      id: 'proj-' + p.name,
      name: p.name,
      path: p.path,
      description: p.path,
      category: 'project',
      icon: 'folder',
      type: 'project'
    }));
  }

  const query = appState.searchQuery.toLowerCase().trim();
  if (!query) return list;

  return list.filter(item => {
    return item.name.toLowerCase().includes(query) ||
           (item.description && item.description.toLowerCase().includes(query)) ||
           (item.cmd && item.cmd.toLowerCase().includes(query)) ||
           (item.url && item.url.toLowerCase().includes(query));
  });
}

function renderGrid() {
  const grid = document.getElementById('ai-grid');
  const empty = document.getElementById('empty-state');
  grid.innerHTML = '';

  const items = getFilteredItems();
  if (items.length === 0) {
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'ai-card group';

    const hotkeyNum = index < 9 ? (index + 1) : null;
    const hotkeyBadge = hotkeyNum ? `<span class="px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono text-[10px] border border-white/10 group-hover:border-indigo-400 group-hover:text-indigo-300">[${hotkeyNum}]</span>` : '';

    const runningBadge = item.running ? `
      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span> Running
      </span>
    ` : '';

    const typeBadge = `
      <span class="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-mono bg-white/5 text-slate-400 border border-white/5">
        ${item.type === 'desktop' ? 'Desktop IDE' : item.type === 'cli' ? 'CLI Agent' : item.type === 'web' ? 'Web AI' : 'Workspace'}
      </span>
    `;

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center space-x-2.5">
            <div class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              ${getIcon(item.icon)}
            </div>
            <div>
              <div class="flex items-center space-x-1.5">
                <h4 class="font-bold text-sm text-white group-hover:text-indigo-300 transition-colors">${item.name}</h4>
                ${hotkeyBadge}
              </div>
              <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${item.description || item.cmd || item.url || item.path || ''}</p>
            </div>
          </div>
          <div class="flex flex-col items-end space-y-1">
            ${runningBadge}
            ${typeBadge}
          </div>
        </div>
      </div>

      <div class="pt-3 border-t border-white/5 mt-3 flex items-center justify-between">
        <div class="flex space-x-1.5">
          <button class="btn-launch px-3 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium flex items-center space-x-1 shadow-sm transition-all active:scale-95">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>${item.type === 'project' ? 'Open Project' : 'Launch'}</span>
          </button>

          ${item.type === 'desktop' ? `
            <button class="btn-open-proj px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs border border-white/10 flex items-center space-x-1 transition-all active:scale-95" title="Open selected workspace directory in ${item.name}">
              <svg class="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
              <span>Project...</span>
            </button>
          ` : ''}

          ${item.custom ? `
            <button class="btn-remove-web px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs border border-rose-500/20" title="Delete custom Web AI">
              &times;
            </button>
          ` : ''}
        </div>

        ${item.running ? `
          <button class="btn-stop px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-mono border border-rose-500/30 transition-all" title="Stop Process">
            Kill
          </button>
        ` : ''}
      </div>
    `;

    // Bind event handlers
    const btnLaunch = card.querySelector('.btn-launch');
    btnLaunch.onclick = () => executeItem(item);

    const btnOpenProj = card.querySelector('.btn-open-proj');
    if (btnOpenProj) {
      btnOpenProj.onclick = () => openProjectPickerModal(item);
    }

    const btnRemoveWeb = card.querySelector('.btn-remove-web');
    if (btnRemoveWeb) {
      btnRemoveWeb.onclick = async () => {
        if (confirm(`Remove custom Web AI "${item.name}"?`)) {
          await fetch('/api/web-ai/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: item.id })
          });
          loadData();
        }
      };
    }

    const btnStop = card.querySelector('.btn-stop');
    if (btnStop) {
      btnStop.onclick = async () => {
        await fetch('/api/stop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyword: item.name.toLowerCase() })
        });
        showToast(`Stopped ${item.name}`);
        setTimeout(loadData, 1000);
      };
    }

    grid.appendChild(card);
  });
}

async function executeItem(item, projectPath = null) {
  showToast(`Executing ${item.name}...`);
  try {
    if (item.type === 'project') {
      // Pick default IDE (Cursor or Kiro)
      const ide = appState.desktopApps.find(a => a.id === 'desktop-cursor') || appState.desktopApps[0];
      if (ide) {
        await fetch('/api/launch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'desktop', item: ide, projectPath: item.path })
        });
        showToast(`Opened ${item.name} in ${ide.name}`);
      }
      return;
    }

    const res = await fetch('/api/launch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: item.type,
        item,
        projectPath
      })
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Success: ${json.message}`);
    } else {
      showToast(`Error: ${json.error}`);
    }
  } catch (err) {
    showToast(`Launch failed: ${err.message}`);
  }
}

// Project Picker Modal
function openProjectPickerModal(aiItem) {
  appState.selectedProjectForAi = aiItem;
  const modal = document.getElementById('modal-project-picker');
  document.getElementById('picker-title').innerText = `Open Workspace in ${aiItem.name}`;
  document.getElementById('picker-subtitle').innerText = `Select any detected project from Shohoz, Personal_Projects or Desktop`;

  renderProjectPickerList(appState.projects);
  modal.classList.remove('hidden');
}

function renderProjectPickerList(projects) {
  const container = document.getElementById('picker-list');
  container.innerHTML = '';

  projects.forEach(proj => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-indigo-600/30 border border-white/5 hover:border-indigo-500/40 cursor-pointer transition-all';
    row.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="text-amber-400">${getIcon('folder')}</div>
        <div>
          <h5 class="text-xs font-bold text-white">${proj.name}</h5>
          <p class="text-[10px] text-slate-400 font-mono">${proj.path}</p>
        </div>
      </div>
      <button class="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-medium">Select</button>
    `;
    row.onclick = () => {
      document.getElementById('modal-project-picker').classList.add('hidden');
      executeItem(appState.selectedProjectForAi, proj.path);
    };
    container.appendChild(row);
  });
}

// Setup Event Listeners
function setupEvents() {
  // Search Input
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    renderGrid();
  });

  // Category Tabs
  document.querySelectorAll('#category-tabs .cat-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#category-tabs .cat-tab').forEach(t => {
        t.classList.remove('active');
        t.classList.add('text-slate-400');
      });
      tab.classList.add('active');
      tab.classList.remove('text-slate-400');

      appState.activeCategory = tab.dataset.cat;
      renderGrid();
    });
  });

  // Sync Button
  document.getElementById('btn-sync').addEventListener('click', loadData);

  // Add Web AI Modal
  const modalWeb = document.getElementById('modal-web-ai');
  document.getElementById('btn-add-web').addEventListener('click', () => {
    modalWeb.classList.remove('hidden');
    document.getElementById('input-web-name').focus();
  });
  document.getElementById('modal-close').addEventListener('click', () => modalWeb.classList.add('hidden'));
  document.getElementById('btn-cancel-modal').addEventListener('click', () => modalWeb.classList.add('hidden'));

  document.getElementById('form-add-web-ai').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('input-web-name').value;
    const url = document.getElementById('input-web-url').value;
    const desc = document.getElementById('input-web-desc').value;
    const appMode = document.getElementById('input-web-appmode').checked;

    await fetch('/api/web-ai/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        url,
        description: desc,
        defaultAppMode: appMode
      })
    });

    modalWeb.classList.add('hidden');
    document.getElementById('form-add-web-ai').reset();
    showToast(`Added ${name}!`);
    loadData();
  });

  // Project Picker Search & Close
  document.getElementById('picker-close').addEventListener('click', () => {
    document.getElementById('modal-project-picker').classList.add('hidden');
  });
  document.getElementById('picker-search').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    const filtered = appState.projects.filter(p => p.name.toLowerCase().includes(q) || p.path.toLowerCase().includes(q));
    renderProjectPickerList(filtered);
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Escape closes modal or clears search
    if (e.key === 'Escape') {
      if (!modalWeb.classList.contains('hidden')) {
        modalWeb.classList.add('hidden');
        return;
      }
      const picker = document.getElementById('modal-project-picker');
      if (!picker.classList.contains('hidden')) {
        picker.classList.add('hidden');
        return;
      }
      if (searchInput.value) {
        searchInput.value = '';
        appState.searchQuery = '';
        renderGrid();
      }
    }

    // Number keys 1-9 to launch top results if not focusing text inputs
    if (document.activeElement !== searchInput && 
        document.activeElement.tagName !== 'INPUT' && 
        e.key >= '1' && e.key <= '9') {
      const idx = parseInt(e.key, 10) - 1;
      const items = getFilteredItems();
      if (items[idx]) {
        executeItem(items[idx]);
      }
    }

    // Enter key launches first item
    if (e.key === 'Enter' && document.activeElement === searchInput) {
      const items = getFilteredItems();
      if (items.length > 0) {
        executeItem(items[0]);
      }
    }

    // Tab key cycles categories
    if (e.key === 'Tab' && document.activeElement !== searchInput && document.activeElement.tagName !== 'INPUT') {
      e.preventDefault();
      const tabs = Array.from(document.querySelectorAll('#category-tabs .cat-tab'));
      const activeIdx = tabs.findIndex(t => t.classList.contains('active'));
      const nextIdx = (activeIdx + 1) % tabs.length;
      tabs[nextIdx].click();
    }
  });

  // Auto-refresh running status every 5 seconds
  setInterval(async () => {
    try {
      const res = await fetch('/api/scan');
      const json = await res.json();
      if (json.success) {
        appState.desktopApps = json.data.desktopApps || [];
        appState.cliAgents = json.data.cliAgents || [];
        updateCounts();
      }
    } catch (e) {}
  }, 5000);
}

// Init
window.addEventListener('DOMContentLoaded', () => {
  setupEvents();
  loadData();
});
