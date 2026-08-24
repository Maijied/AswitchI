const http = require('http');
const fs = require('fs');
const path = require('path');
const { scanAll, scanProjects } = require('./main/scanner');
const { launchDesktopApp, launchCliAgent, launchWebAi, stopApp } = require('./main/executor');
const { getConfig, saveConfig, addCustomWebAi, removeCustomWebAi, getWebAis } = require('./main/config');

const PORT = process.env.PORT || 49234;
const RENDERER_DIR = path.join(__dirname, 'renderer');
const ASSETS_DIR = path.join(__dirname, '..', 'assets');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const host = req.headers.host || `127.0.0.1:${PORT}`;
  const reqUrl = new URL(req.url, `http://${host}`);
  const pathname = reqUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // --- API Endpoints ---
  if (pathname === '/api/scan' && req.method === 'GET') {
    try {
      const data = scanAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  if (pathname === '/api/projects' && req.method === 'GET') {
    try {
      const projects = scanProjects();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, projects }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  if (pathname === '/api/launch' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { type, item, projectPath } = body;
      let result;

      if (type === 'desktop') {
        result = await launchDesktopApp(item, projectPath);
      } else if (type === 'cli') {
        result = await launchCliAgent(item, projectPath);
      } else if (type === 'web') {
        result = await launchWebAi(item);
      } else {
        throw new Error('Unknown AI launch type: ' + type);
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  if (pathname === '/api/stop' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const result = await stopApp(body.keyword);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  if (pathname === '/api/web-ai/add' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const added = addCustomWebAi(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, added }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  if (pathname === '/api/web-ai/remove' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const remaining = removeCustomWebAi(body.id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, remaining }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  if (pathname === '/api/config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getConfig()));
    return;
  }

  if (pathname === '/api/config' && req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const updated = saveConfig(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, config: updated }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: e.message }));
    }
    return;
  }

  // --- Static Files Serving ---
  let filePath = path.join(RENDERER_DIR, pathname === '/' ? 'index.html' : pathname);

  if (pathname.startsWith('/assets/')) {
    filePath = path.join(ASSETS_DIR, pathname.replace('/assets/', ''));
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function startServer(port = PORT) {
  return new Promise((resolve) => {
    server.listen(port, () => {
      console.log(`AswitchI Server running on http://127.0.0.1:${port}`);
      resolve({ port, server });
    });
  });
}

if (require.main === module) {
  startServer();
}

module.exports = { server, startServer, PORT };
