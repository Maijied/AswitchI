/**
 * AswitchI — Modern Interactive Script (Lorapok Labs Engine)
 * Features: Cyber Mesh Canvas, Telemetry HUD, Web Audio SFX Synthesis, GA4 Event Tracking
 */

// 1. Web Audio API Futuristic Sound Synthesis (Zero external asset latency)
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('aswitchi-sfx') !== 'false';
    this.updateIcon();
  }

  init() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playBeep(freq = 600, duration = 0.06, type = 'sine') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playSwitch() {
    this.playBeep(880, 0.08, 'triangle');
  }

  playLaunch() {
    this.playBeep(440, 0.15, 'sine');
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('aswitchi-sfx', this.enabled);
    this.updateIcon();
    if (this.enabled) this.playSwitch();
  }

  updateIcon() {
    const icon = document.getElementById('sfx-icon');
    if (icon) {
      icon.textContent = this.enabled ? '🔊' : '🔇';
    }
  }
}

const sfx = new SoundFX();
const sfxBtn = document.getElementById('sfx-toggle');
if (sfxBtn) {
  sfxBtn.addEventListener('click', () => sfx.toggle());
}

// 2. Scroll Progress Bar
window.addEventListener('scroll', () => {
  const scrollProgress = document.getElementById('scroll-progress');
  if (scrollProgress) {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
  }
}, { passive: true });

// 3. Interactive Theme Toggle (Dark / Light)
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    sfx.playSwitch();
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('aswitchi-theme', newTheme);
    
    const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (metaColorScheme) {
      metaColorScheme.content = newTheme;
    }
    window.trackEvent('Settings', 'toggle_theme', newTheme);
  });
}

// 4. Live Simulator Deck Data & Interaction
const simData = {
  ides: [
    {
      icon: '⚡',
      title: 'Cursor AI',
      desc: 'AI-first code editor with Claude 3.5 Sonnet & GPT-4o indexing.',
      type: 'Desktop IDE',
      cmd: 'cursor .'
    },
    {
      icon: '🌊',
      title: 'Windsurf IDE',
      desc: 'Codeium-powered next-gen AI agentic IDE environment.',
      type: 'Desktop IDE',
      cmd: 'windsurf .'
    },
    {
      icon: '💻',
      title: 'VS Code Insiders',
      desc: 'Configured with Cline & Continue.dev autonomous agents.',
      type: 'Desktop IDE',
      cmd: 'code-insiders .'
    }
  ],
  cli: [
    {
      icon: '🤖',
      title: 'Aider AI',
      desc: 'Terminal pair-programming AI agent with git-auto commits.',
      type: 'CLI Agent',
      cmd: 'aider --model claude-3-5-sonnet'
    },
    {
      icon: '🛠️',
      title: 'Cline CLI',
      desc: 'Autonomous CLI task worker with MCP tool integration.',
      type: 'CLI Agent',
      cmd: 'cline task "audit codebase"'
    },
    {
      icon: '🦙',
      title: 'Ollama Engine',
      desc: 'Local neural model runtime for DeepSeek & Llama-3.',
      type: 'Local LLM',
      cmd: 'ollama run deepseek-coder-v2'
    }
  ],
  web: [
    {
      icon: '🧠',
      title: 'Claude 3.7 Sonnet',
      desc: 'Persistent sandboxed WebKit profile with Artifacts support.',
      type: 'Encrypted WebKit',
      cmd: 'aswitchi --launch claude'
    },
    {
      icon: '✨',
      title: 'ChatGPT Plus',
      desc: 'Sandboxed OpenAI session with Advanced Voice & Canvas.',
      type: 'Encrypted WebKit',
      cmd: 'aswitchi --launch chatgpt'
    },
    {
      icon: '💎',
      title: 'Gemini 2.5 Flash',
      desc: 'Google AI workspace with 2M token context window.',
      type: 'Encrypted WebKit',
      cmd: 'aswitchi --launch gemini'
    }
  ]
};

function renderSimDeck(category) {
  const deck = document.getElementById('sim-deck');
  if (!deck) return;
  
  const items = simData[category] || simData.ides;
  deck.innerHTML = items.map(item => `
    <div class="sim-card" onclick="simulateLaunch('${item.title}', '${item.cmd}')">
      <div class="sim-card-header">
        <span class="sim-icon">${item.icon}</span>
        <span class="sim-launch-badge">${item.type}</span>
      </div>
      <h3 class="sim-card-title">${item.title}</h3>
      <p class="sim-card-desc">${item.desc}</p>
      <div class="code-pill" style="margin-top:auto; font-size:0.78rem;">
        <code>$ ${item.cmd}</code>
      </div>
    </div>
  `).join('');
}

window.simulateLaunch = function(title, cmd) {
  sfx.playLaunch();
  const statusText = document.getElementById('sim-status-text');
  if (statusText) {
    statusText.innerHTML = `<span style="color:var(--cyan)">🚀 Launching ${title}...</span>`;
    setTimeout(() => {
      statusText.innerHTML = `Active Session (${title} Running)`;
    }, 1500);
  }
  window.trackEvent('Simulator', 'launch_app', title);
};

const tabButtons = document.querySelectorAll('.sim-tab');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    sfx.playSwitch();
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.getAttribute('data-category');
    renderSimDeck(cat);
    window.trackEvent('Simulator', 'switch_tab', cat);
  });
});

// Initial Deck Render
renderSimDeck('ides');

// 5. Copy Terminal Command
const copyBtn = document.getElementById('copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    sfx.playSwitch();
    const textToCopy = "aswitchi --status\naswitchi --launch claude";
    navigator.clipboard.writeText(textToCopy).then(() => {
      const copyText = document.getElementById('copy-text');
      if (copyText) {
        copyText.textContent = "Copied!";
        setTimeout(() => { copyText.textContent = "Copy"; }, 2000);
      }
    });
    window.trackEvent('CLI', 'copy_command', 'aswitchi_status');
  });
}

// 6. Ambient Cyber Canvas Particle Animation
const canvas = document.getElementById('cyber-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${this.alpha})`;
      ctx.fill();
    }
  }

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

// 7. GSAP Smooth Scroll Enhancements
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray('.reveal-node').forEach(elem => {
    gsap.fromTo(elem,
      { y: 30, opacity: 0 },
      {
        scrollTrigger: {
          trigger: elem,
          start: 'top 88%',
          toggleActions: 'play none none none'
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out'
      }
    );
  });
}

// 8. High-Performance Animated Tab Favicon Engine
(function initAnimatedFavicon() {
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const faviconLink = document.querySelector("link[rel~='icon']") || document.createElement('link');
  faviconLink.rel = 'icon';
  faviconLink.type = 'image/png';
  document.head.appendChild(faviconLink);

  let angle = 0;
  let pulse = 0;

  function renderFaviconFrame() {
    ctx.clearRect(0, 0, 32, 32);

    // Dark Rounded Squircle Base
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(2, 2, 28, 28, 7);
    } else {
      ctx.rect(2, 2, 28, 28);
    }
    ctx.fill();

    // Cyber Border
    ctx.strokeStyle = '#4338ca';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Pulsing/Rotating Circuit Orbit
    ctx.save();
    ctx.translate(16, 16);
    ctx.rotate(angle);
    ctx.strokeStyle = '#38bdf8';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, 8.5 + Math.sin(pulse) * 1.2, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Central Switcher Lightning Core
    ctx.save();
    ctx.translate(16, 16);
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.moveTo(1.2, -6.5);
    ctx.lineTo(-3.8, 1);
    ctx.lineTo(0.2, 1);
    ctx.lineTo(-1, 6.5);
    ctx.lineTo(4.8, -1);
    ctx.lineTo(1, -1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    faviconLink.href = canvas.toDataURL('image/png');
    angle += 0.05;
    pulse += 0.1;
  }

  // Update animated favicon at ~15fps (smooth & battery efficient)
  setInterval(renderFaviconFrame, 66);
})();


// Dynamic Snap Store Versioning Tracker
async function fetchSnapVersions() {
    const container = document.getElementById('snap-channels-container');
    if (!container) return;

    try {
        const response = await fetch('https://api.snapcraft.io/v2/snaps/info/aswitchi', {
            headers: {
                'Snap-Device-Series': '16'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                // If 404, it means the snap is still pending manual review for classic confinement
                container.innerHTML = `
                    <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(100, 255, 218, 0.05); border-radius: 4px; font-family: monospace; font-size: 0.85rem;">
                        <span style="color: #cbd5e1; font-weight: bold;">ALL CHANNELS</span>
                        <span style="color: #fbbf24;">Pending Canonical Review</span>
                    </div>
                `;
                return;
            }
            throw new Error('API Error');
        }

        const data = await response.json();
        const channelMap = data['channel-map'];
        
        let html = '';
        const channels = ['stable', 'candidate', 'beta', 'edge'];
        
        channels.forEach(ch => {
            // Find the latest amd64 release for this channel
            const release = channelMap.find(item => item.channel.name === ch && item.channel.architecture === 'amd64' && item.channel.track === 'latest');
            
            let version = release ? release.version : 'Not published';
            let color = release ? '#64ffda' : '#64748b';
            
            html += `
                <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(100, 255, 218, 0.05); border-radius: 4px; font-family: monospace; font-size: 0.85rem;">
                    <span style="color: #cbd5e1; font-weight: bold;">${ch.toUpperCase()}</span>
                    <span style="color: ${color};">${version}</span>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; padding: 6px 10px; background: rgba(100, 255, 218, 0.05); border-radius: 4px; font-family: monospace; font-size: 0.85rem;">
                <span style="color: #cbd5e1; font-weight: bold;">STATUS</span>
                <span style="color: #ef4444;">API Unavailable</span>
            </div>
        `;
    }
}

// Initialize the fetch when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    fetchSnapVersions();
    initHeroShowcase();
});

// Interactive Hero Showcase Tab Switcher
function initHeroShowcase() {
    const showcaseImg = document.getElementById('showcase-img');
    const captionText = document.getElementById('showcase-caption-text');
    const tabs = document.querySelectorAll('.showcase-tab');
    if (!showcaseImg || !tabs.length) return;

    const showcaseData = {
        launchpad: {
            src: 'assets/hero_showcase.png',
            alt: 'AswitchI Native Launchpad Matrix on Ubuntu Linux',
            caption: 'Native Launchpad Matrix with hardware-accelerated GTK3 rendering'
        },
        dock: {
            src: 'assets/dock_strip.png',
            alt: 'AswitchI 3D Glass Dock with Active Process Indicators',
            caption: 'Interactive 3D Glass Dock with spring physics and active process indicator dots'
        },
        webai: {
            src: 'assets/webai_view.png',
            alt: 'AswitchI Sandboxed Persistent Web AI Engine',
            caption: 'Persistent WebKit2GTK standalone web session with cookie & keyring encryption'
        },
        full: {
            src: 'assets/launchpad_full.png',
            alt: 'AswitchI Full Multi-Page Developer Tooling Stack',
            caption: 'Complete multi-page AI tooling stack with zero Electron overhead'
        }
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.getAttribute('data-showcase');
            const data = showcaseData[key];
            if (!data) return;

            sfx.playSwitch();

            tabs.forEach(t => {
                t.classList.remove('active');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');

            showcaseImg.style.opacity = '0.4';
            showcaseImg.style.transform = 'scale(0.98)';

            setTimeout(() => {
                showcaseImg.src = data.src;
                showcaseImg.alt = data.alt;
                if (captionText) captionText.textContent = data.caption;
                showcaseImg.style.opacity = '1';
                showcaseImg.style.transform = 'scale(1)';
            }, 150);

            window.trackEvent('Showcase', 'switch_tab', key);
        });
    });
}

