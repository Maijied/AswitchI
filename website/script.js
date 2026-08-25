/**
 * AswitchI — Public Frontend Logic & Interactive Simulator
 * Lorapok Labs (c) 2026
 */

document.addEventListener("DOMContentLoaded", () => {
  initScrollProgress();
  initCanvasParticles();
  initDockSimulator();
  fetchLiveReleaseChannels();
});

/* Scroll Progress Bar */
function initScrollProgress() {
  const progressBar = document.getElementById("scroll-progress");
  if (!progressBar) return;

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* Showcase Tab Switcher */
window.switchShowcaseTab = function(index) {
  const tabs = document.querySelectorAll(".showcase-tab");
  const slides = document.querySelectorAll(".showcase-slide");

  tabs.forEach((tab, i) => {
    if (i === index) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add("active");
    } else {
      slide.classList.remove("active");
    }
  });

  if (typeof window.trackEvent === "function") {
    window.trackEvent("Showcase", "tab_click", `Slide ${index}`);
  }
};

/* Terminal Command Copy */
window.copyInstallCmd = function() {
  const cmd = "sudo snap install aswitchi --classic";
  copyText(cmd);
  const tooltip = document.getElementById("copy-tooltip");
  if (tooltip) {
    tooltip.classList.add("show");
    setTimeout(() => {
      tooltip.classList.remove("show");
    }, 2000);
  }
};

window.copyText = function(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("✓ Copied to clipboard: " + text);
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
};

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    showToast("✓ Copied: " + text);
  } catch (err) {
    showToast("Command: " + text);
  }
  document.body.removeChild(textarea);
}

function showToast(msg) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/* In-Browser 3D Dock Simulator with Gaussian Scaling */
function initDockSimulator() {
  const dock = document.getElementById("sim-dock");
  const tooltip = document.getElementById("sim-dock-tooltip");
  if (!dock) return;

  const items = dock.querySelectorAll(".sim-dock-item");

  dock.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX;

    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);
      
      // Gaussian curve magnification: max scale 1.45 within 120px radius
      const maxDistance = 120;
      let scale = 1;
      if (distance < maxDistance) {
        const factor = Math.cos((distance / maxDistance) * (Math.PI / 2));
        scale = 1 + 0.45 * factor;
      }

      item.style.transform = `scale(${scale}) translateY(${-(scale - 1) * 16}px)`;
    });
  });

  dock.addEventListener("mouseleave", () => {
    items.forEach((item) => {
      item.style.transform = "scale(1) translateY(0)";
    });
    if (tooltip) tooltip.textContent = "Hover over an icon";
  });

  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      const title = item.getAttribute("data-title");
      if (tooltip && title) {
        tooltip.textContent = title;
      }
    });
  });
}

/* Background Cyber Canvas Particles */
function initCanvasParticles() {
  const canvas = document.getElementById("cyber-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }, { passive: true });

  const particles = [];
  const particleCount = Math.min(width > 768 ? 45 : 20, 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 0.6,
      color: Math.random() > 0.5 ? "rgba(0, 242, 254, 0.4)" : "rgba(168, 85, 247, 0.35)"
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* Snap Store Release Telemetry */
async function fetchLiveReleaseChannels() {
  const container = document.getElementById("snap-channels-container");
  if (!container) return;

  try {
    const res = await fetch("https://api.snapcraft.io/v2/snaps/info/aswitchi", {
      headers: { "Snap-Device-Series": "16" }
    });
    if (!res.ok) throw new Error("API Offline");
    const data = await res.json();
    const tracks = data["channel-map"] || [];

    if (tracks.length > 0) {
      container.innerHTML = "";
      const displayedChannels = new Set();

      tracks.forEach(track => {
        const channelName = track.channel.risk;
        const version = track.version;
        const arch = track.channel.architecture;
        const key = `${channelName}-${version}`;

        if (!displayedChannels.has(key)) {
          displayedChannels.add(key);
          const row = document.createElement("div");
          row.className = "channel-row";
          const badgeClass = channelName === "stable" ? "badge-stable" : "stat-pill-lbl";
          row.innerHTML = `
            <span class="${badgeClass}">${channelName}</span>
            <span class="text-slate-200">${version}</span>
            <span class="text-slate-400">(${arch})</span>
          `;
          container.appendChild(row);
        }
      });
    }
  } catch (err) {
    // Graceful fallback to cached official stable
    container.innerHTML = `
      <div class="channel-row">
        <span class="badge-stable">stable</span>
        <span class="text-slate-200">v1.0.0</span>
        <span class="text-slate-400">multi-arch (amd64, arm64)</span>
      </div>
    `;
  }
}
