const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { getWebAis, getConfig } = require('./config');

const KNOWN_DESKTOP_PATTERNS = [
  { id: 'desktop-cursor', name: 'Cursor', match: ['cursor'], priority: 10, category: 'ide', icon: 'cursor', color: '#6366F1' },
  { id: 'desktop-dcursor', name: 'dCursor (Duplicator)', match: ['dcursor'], priority: 9, category: 'ide', icon: 'cursor', color: '#8B5CF6' },
  { id: 'desktop-kiro', name: 'Kiro IDE', match: ['kiro'], priority: 10, category: 'ide', icon: 'kiro', color: '#EC4899' },
  { id: 'desktop-claude', name: 'Claude Desktop', match: ['claude'], priority: 10, category: 'desktop-ai', icon: 'claude', color: '#D97706' },
  { id: 'desktop-chatgpt', name: 'ChatGPT Desktop', match: ['chatgpt'], priority: 10, category: 'desktop-ai', icon: 'chatgpt', color: '#10B981' },
  { id: 'desktop-devin', name: 'Devin Desktop', match: ['devin'], priority: 10, category: 'ide', icon: 'devin', color: '#06B6D4' },
  { id: 'desktop-windsurf', name: 'Windsurf IDE', match: ['windsurf'], priority: 10, category: 'ide', icon: 'windsurf', color: '#3B82F6' },
  { id: 'desktop-antigravity', name: 'Antigravity IDE', match: ['antigravity-ide', 'antigravity'], priority: 10, category: 'ide', icon: 'antigravity', color: '#EF4444' }
];

const KNOWN_CLI_AGENTS = [
  { id: 'cli-agy', name: 'Antigravity CLI (agy)', cmd: 'agy', match: ['agy'], description: 'Google DeepMind Antigravity CLI Agent', icon: 'antigravity', color: '#EF4444' },
  { id: 'cli-cursor-agent', name: 'Cursor Agent', cmd: 'cursor-agent', match: ['cursor-agent', 'cursor agent'], description: 'Cursor Headless Coding Agent', icon: 'cursor', color: '#6366F1' },
  { id: 'cli-dcursor-agent', name: 'dCursor Agent', cmd: 'dcursor-agent', match: ['dcursor-agent'], description: 'dCursor Isolated Coding Agent', icon: 'cursor', color: '#8B5CF6' },
  { id: 'cli-claude', name: 'Claude Code CLI', cmd: 'claude', match: ['claude'], description: 'Anthropic Claude Code CLI Assistant', icon: 'claude', color: '#D97706' },
  { id: 'cli-kiro', name: 'Kiro CLI', cmd: 'kiro-cli', match: ['kiro-cli'], description: 'Kiro Spec-Driven Coding Agent CLI', icon: 'kiro', color: '#EC4899' },
  { id: 'cli-devin', name: 'Devin CLI', cmd: 'devin', match: ['devin'], description: 'Devin AI Software Engineer CLI', icon: 'devin', color: '#06B6D4' },
  { id: 'cli-gemini', name: 'Gemini CLI', cmd: 'gemini', match: ['gemini'], description: 'Google Gemini Command Line Interface', icon: 'gemini', color: '#3B82F6' },
  { id: 'cli-codex', name: 'Codex CLI', cmd: 'codex', match: ['codex'], description: 'OpenAI / Codex Agent Tool', icon: 'chatgpt', color: '#10B981' }
];

function getRunningProcessList() {
  try {
    const stdout = execSync('ps -eo pid,comm,args --no-headers', { encoding: 'utf-8' });
    return stdout.toLowerCase();
  } catch (e) {
    return '';
  }
}

function scanDesktopApplications(processOutput) {
  const desktopDirs = [
    '/usr/share/applications',
    path.join(os.homedir(), '.local', 'share', 'applications')
  ];

  const found = new Map();

  for (const dir of desktopDirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.desktop')) continue;
      const fullPath = path.join(dir, file);
      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        let name = '';
        let execCmd = '';
        let icon = '';
        let noDisplay = false;

        for (const line of content.split('\n')) {
          if (line.startsWith('Name=') && !name) name = line.substring(5).trim();
          if (line.startsWith('Exec=') && !execCmd) execCmd = line.substring(5).trim();
          if (line.startsWith('Icon=') && !icon) icon = line.substring(5).trim();
          if (line.startsWith('NoDisplay=true')) noDisplay = true;
        }

        if (noDisplay) continue;
        if (!name || !execCmd) continue;

        // Check if matches known AI patterns
        const lowerName = name.toLowerCase();
        const lowerFile = file.toLowerCase();
        const lowerExec = execCmd.toLowerCase();

        for (const pattern of KNOWN_DESKTOP_PATTERNS) {
          const isMatch = pattern.match.some(m =>
            lowerName.includes(m) || lowerFile.includes(m) || lowerExec.includes(m)
          );

          // Exclude URL handlers or bridge entries to keep it clean
          if (isMatch && !lowerName.includes('url handler') && !lowerName.includes('bridge')) {
            const isRunning = pattern.match.some(m => processOutput.includes(m));
            if (!found.has(pattern.id) || dir.includes('.local')) {
              found.set(pattern.id, {
                id: pattern.id,
                name: pattern.name || name,
                category: pattern.category,
                exec: execCmd.replace(/%[a-zA-Z]/g, '').trim(),
                desktopFile: fullPath,
                icon: pattern.icon,
                color: pattern.color,
                running: isRunning,
                installed: true,
                type: 'desktop'
              });
            }
          }
        }
      } catch (err) {}
    }
  }

  // Also check direct binary locations if desktop file was omitted
  if (!found.has('desktop-kiro') && (fs.existsSync('/home/maizied/.local/bin/kiro') || fs.existsSync('/usr/bin/kiro'))) {
    found.set('desktop-kiro', {
      id: 'desktop-kiro',
      name: 'Kiro IDE',
      category: 'ide',
      exec: '/home/maizied/.local/share/kiro-ide/kiro',
      icon: 'kiro',
      color: '#EC4899',
      running: processOutput.includes('kiro'),
      installed: true,
      type: 'desktop'
    });
  }

  // Check AppImages in ~/Downloads or ~/Applications
  const appImageDirs = [
    path.join(os.homedir(), 'Downloads'),
    path.join(os.homedir(), 'Applications')
  ];
  for (const d of appImageDirs) {
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.AppImage') && f.toLowerCase().includes('kiro')) {
        const full = path.join(d, f);
        found.set('desktop-kirocrew', {
          id: 'desktop-kirocrew',
          name: 'KiroCrew AppImage',
          category: 'desktop-ai',
          exec: full,
          icon: 'kiro',
          color: '#EC4899',
          running: processOutput.includes('kirocrew'),
          installed: true,
          type: 'desktop'
        });
      }
    }
  }

  return Array.from(found.values());
}

function scanCliAgents(processOutput) {
  const pathDirs = (process.env.PATH || '').split(':');
  const found = [];

  for (const agent of KNOWN_CLI_AGENTS) {
    let binaryPath = '';
    for (const dir of pathDirs) {
      const full = path.join(dir, agent.cmd);
      if (fs.existsSync(full)) {
        try {
          fs.accessSync(full, fs.constants.X_OK);
          binaryPath = full;
          break;
        } catch (e) {}
      }
    }

    if (binaryPath) {
      const isRunning = agent.match.some(m => processOutput.includes(m));
      found.push({
        id: agent.id,
        name: agent.name,
        cmd: agent.cmd,
        binaryPath,
        description: agent.description,
        category: 'cli',
        icon: agent.icon,
        color: agent.color,
        running: isRunning,
        installed: true,
        type: 'cli'
      });
    }
  }

  return found;
}

function scanProjects() {
  const config = getConfig();
  const searchRoots = config.customWorkspacePaths || [
    path.join(os.homedir(), 'Shohoz'),
    path.join(os.homedir(), 'Desktop'),
    '/mnt/NewVolume/Personal_Projects'
  ];

  const projects = [];
  const projectIndicators = ['.git', 'package.json', 'composer.json', 'requirements.txt', 'Cargo.toml', 'pubspec.yaml', 'go.mod'];

  function explore(dir, depth = 0) {
    if (depth > 2) return;
    if (!fs.existsSync(dir)) return;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'vendor') continue;

        const subPath = path.join(dir, entry.name);
        try {
          const subEntries = fs.readdirSync(subPath);
          const hasIndicator = subEntries.some(f => projectIndicators.includes(f));
          if (hasIndicator) {
            projects.push({
              name: entry.name,
              path: subPath,
              parent: path.basename(dir),
              lastModified: fs.statSync(subPath).mtimeMs
            });
          } else {
            explore(subPath, depth + 1);
          }
        } catch (err) {}
      }
    } catch (err) {}
  }

  for (const root of searchRoots) {
    explore(root, 0);
  }

  // Sort by recent
  projects.sort((a, b) => b.lastModified - a.lastModified);
  return projects;
}

function scanAll() {
  const proc = getRunningProcessList();
  const desktopApps = scanDesktopApplications(proc);
  const cliAgents = scanCliAgents(proc);
  const webAis = getWebAis();
  const projects = scanProjects();

  return {
    desktopApps,
    cliAgents,
    webAis,
    projects,
    summary: {
      totalInstalledAIs: desktopApps.length + cliAgents.length,
      desktopCount: desktopApps.length,
      cliCount: cliAgents.length,
      webCount: webAis.length,
      projectCount: projects.length
    },
    scannedAt: new Date().toISOString()
  };
}

module.exports = {
  scanAll,
  scanDesktopApplications,
  scanCliAgents,
  scanProjects
};
