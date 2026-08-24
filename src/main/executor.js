const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');
const { getConfig } = require('./config');

function findTerminalEmulator() {
  const terminals = ['gnome-terminal', 'x-terminal-emulator', 'konsole', 'xfce4-terminal', 'xterm'];
  return 'gnome-terminal'; // Standard on Ubuntu
}

function launchDesktopApp(app, projectPath = null) {
  return new Promise((resolve, reject) => {
    let cmd = app.exec;
    let args = [];

    // Parse base command & args
    const parts = cmd.split(' ');
    const binary = parts[0];
    args = parts.slice(1);

    if (projectPath) {
      args.push(projectPath);
    }

    try {
      const child = spawn(binary, args, {
        detached: true,
        stdio: 'ignore',
        env: process.env
      });
      child.unref();
      resolve({ success: true, message: `Launched ${app.name}`, pid: child.pid });
    } catch (err) {
      reject({ success: false, error: err.message });
    }
  });
}

function launchCliAgent(agent, projectPath = null) {
  return new Promise((resolve, reject) => {
    const cwd = projectPath || os.homedir();
    const terminal = findTerminalEmulator();
    const cmdStr = agent.cmd;

    // Launch in interactive terminal window
    const script = `cd "${cwd}" && echo -e "\\e[1;34m==> Launching ${agent.name}...\\e[0m\\n" && ${cmdStr}; exec bash`;
    const termArgs = ['--title', `${agent.name}`, '--', 'bash', '-c', script];

    try {
      const child = spawn(terminal, termArgs, {
        detached: true,
        stdio: 'ignore',
        cwd,
        env: process.env
      });
      child.unref();
      resolve({ success: true, message: `Started ${agent.name} in terminal`, cwd });
    } catch (err) {
      reject({ success: false, error: err.message });
    }
  });
}

function launchWebAi(webAi) {
  return new Promise((resolve, reject) => {
    const config = getConfig();
    const browserPref = config.browserPreference || 'chrome';
    let browserBin = '/opt/google/chrome/google-chrome';

    if (browserPref === 'brave' && fs.existsSync('/usr/bin/brave-browser')) {
      browserBin = '/usr/bin/brave-browser';
    }

    let args = [];
    if (webAi.defaultAppMode) {
      // Standalone Mac-app style app-window
      args = [`--app=${webAi.url}`];
    } else {
      args = [webAi.url];
    }

    try {
      const child = spawn(browserBin, args, {
        detached: true,
        stdio: 'ignore',
        env: process.env
      });
      child.unref();
      resolve({ success: true, message: `Opened ${webAi.name} in app window` });
    } catch (err) {
      // Fallback to xdg-open
      exec(`xdg-open "${webAi.url}"`, (e) => {
        if (e) reject({ success: false, error: e.message });
        else resolve({ success: true, message: `Opened ${webAi.name} in browser` });
      });
    }
  });
}

function stopApp(matchKeyword) {
  return new Promise((resolve) => {
    exec(`pkill -f "${matchKeyword}"`, (err, stdout, stderr) => {
      resolve({ success: !err, output: stdout || stderr });
    });
  });
}

module.exports = {
  launchDesktopApp,
  launchCliAgent,
  launchWebAi,
  stopApp
};
