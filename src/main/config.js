const fs = require('fs');
const path = require('path');
const os = require('os');

const CONFIG_DIR = path.join(os.homedir(), '.config', 'aswitchi');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

const DEFAULT_WEB_AIS = [
  {
    id: 'web-claude',
    name: 'Claude Web',
    url: 'https://claude.ai',
    description: 'Anthropic Claude 3.5 Sonnet & Opus interactive workspace',
    category: 'web',
    icon: 'claude',
    color: '#D97706',
    defaultAppMode: true
  },
  {
    id: 'web-chatgpt',
    name: 'ChatGPT Web',
    url: 'https://chatgpt.com',
    description: 'OpenAI ChatGPT 4o, Canvas, and Advanced Voice',
    category: 'web',
    icon: 'chatgpt',
    color: '#10B981',
    defaultAppMode: true
  },
  {
    id: 'web-gemini',
    name: 'Google Gemini',
    url: 'https://gemini.google.com',
    description: 'Google Gemini 1.5 Pro & Deep Research',
    category: 'web',
    icon: 'gemini',
    color: '#3B82F6',
    defaultAppMode: true
  },
  {
    id: 'web-aistudio',
    name: 'Google AI Studio',
    url: 'https://aistudio.google.com',
    description: 'Direct access to Gemini 2.0 / Flash / Pro Developer Playground',
    category: 'web',
    icon: 'gemini',
    color: '#6366F1',
    defaultAppMode: true
  },
  {
    id: 'web-perplexity',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai',
    description: 'Real-time AI search, research engine & reasoning models',
    category: 'web',
    icon: 'perplexity',
    color: '#06B6D4',
    defaultAppMode: true
  },
  {
    id: 'web-deepseek',
    name: 'DeepSeek Chat',
    url: 'https://chat.deepseek.com',
    description: 'DeepSeek V3 & R1 Reasoning Engine',
    category: 'web',
    icon: 'deepseek',
    color: '#4F46E5',
    defaultAppMode: true
  },
  {
    id: 'web-v0',
    name: 'v0 by Vercel',
    url: 'https://v0.dev',
    description: 'Generative UI development with React, Tailwind & Next.js',
    category: 'web',
    icon: 'v0',
    color: '#000000',
    defaultAppMode: true
  },
  {
    id: 'web-grok',
    name: 'Grok (xAI)',
    url: 'https://grok.com',
    description: 'xAI Grok conversational and vision model',
    category: 'web',
    icon: 'grok',
    color: '#64748B',
    defaultAppMode: true
  },
  {
    id: 'web-hf',
    name: 'HuggingChat',
    url: 'https://huggingface.co/chat',
    description: 'Open source AI models (Llama 3, Qwen, Mistral) by Hugging Face',
    category: 'web',
    icon: 'huggingface',
    color: '#F59E0B',
    defaultAppMode: true
  }
];

function ensureConfig() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    const initialConfig = {
      theme: 'mac-dark',
      customWebAis: [],
      hiddenAiIds: [],
      favoriteAiIds: ['desktop-cursor', 'desktop-kiro', 'desktop-claude', 'web-claude'],
      customWorkspacePaths: [
        path.join(os.homedir(), 'Shohoz'),
        path.join(os.homedir(), 'Desktop'),
        '/mnt/NewVolume/Personal_Projects'
      ],
      hotkey: 'Super+Space',
      browserPreference: 'chrome' // chrome | brave | default
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(initialConfig, null, 2));
    return initialConfig;
  }
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading config, using defaults:', e);
    return {};
  }
}

function getConfig() {
  return ensureConfig();
}

function saveConfig(updates) {
  const current = ensureConfig();
  const merged = { ...current, ...updates };
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2));
  return merged;
}

function getWebAis() {
  const config = getConfig();
  const custom = config.customWebAis || [];
  return [...DEFAULT_WEB_AIS, ...custom];
}

function addCustomWebAi(entry) {
  const config = getConfig();
  const id = 'custom-web-' + Date.now();
  const newEntry = {
    id,
    name: entry.name.trim(),
    url: entry.url.trim(),
    description: entry.description || 'Custom Web AI',
    category: 'web',
    icon: entry.icon || 'globe',
    color: entry.color || '#3B82F6',
    defaultAppMode: entry.defaultAppMode !== false,
    custom: true
  };
  config.customWebAis = config.customWebAis || [];
  config.customWebAis.push(newEntry);
  saveConfig(config);
  return newEntry;
}

function removeCustomWebAi(id) {
  const config = getConfig();
  config.customWebAis = (config.customWebAis || []).filter(item => item.id !== id);
  saveConfig(config);
  return config.customWebAis;
}

module.exports = {
  getConfig,
  saveConfig,
  getWebAis,
  addCustomWebAi,
  removeCustomWebAi,
  DEFAULT_WEB_AIS
};
