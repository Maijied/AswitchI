#!/usr/bin/env node

const http = require('http');
const { spawn, execSync } = require('child_process');
const path = require('path');
const { startServer, PORT } = require('../src/server');
const { scanAll } = require('../src/main/scanner');

const args = process.argv.slice(2);

// Handle CLI flags
if (args.includes('--list') || args.includes('-l')) {
  const data = scanAll();
  console.log('\n=== AswitchI - Detected AI Tools ===');
  console.log('--- Desktop AI IDEs ---');
  data.desktopApps.forEach(a => console.log(`  • ${a.name} [${a.running ? '🟢 RUNNING' : '⚪ STOPPED'}] -> ${a.exec}`));
  console.log('--- CLI AI Agents ---');
  data.cliAgents.forEach(a => console.log(`  • ${a.name} [${a.running ? '🟢 RUNNING' : '⚪ STOPPED'}] -> ${a.cmd}`));
  console.log('--- Web AIs ---');
  data.webAis.forEach(a => console.log(`  • ${a.name} -> ${a.url}`));
  console.log(`\nTotal: ${data.summary.totalInstalledAIs} installed tools, ${data.summary.projectCount} workspace projects.\n`);
  process.exit(0);
}

if (args.includes('--sync') || args.includes('-s')) {
  const data = scanAll();
  console.log(`Sync complete: Detected ${data.summary.totalInstalledAIs} AI tools and ${data.summary.projectCount} projects.`);
  process.exit(0);
}

// Function to check if server is active
function isServerRunning(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/scan`, (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function launchWindow(port) {
  const url = `http://127.0.0.1:${port}`;
  const chromeArgs = [
    `--app=${url}`,
    '--window-size=1040,720',
    '--class=aswitchi',
    '--user-data-dir=' + path.join(require('os').homedir(), '.config', 'aswitchi', 'browser-data')
  ];

  try {
    const chromeProc = spawn('/opt/google/chrome/google-chrome', chromeArgs, {
      detached: true,
      stdio: 'ignore'
    });
    chromeProc.unref();
  } catch (err) {
    execSync(`xdg-open "${url}"`);
  }
}

async function main() {
  const running = await isServerRunning(PORT);
  if (!running) {
    await startServer(PORT);
  }
  launchWindow(PORT);
  // Keep alive if started standalone
  if (!running) {
    // detach process or keep alive
  }
}

main();
