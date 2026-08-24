with open("src/ui/launchpad.html", "r") as f:
    text = f.read()

import re

replacement = """      <!-- Tab 2: About Lorapok Labs & Developer Info -->
      <div class="help-modal-body hidden" id="modal-body-about">
        <div class="about-hero">
          <img src="icons/aswitchi.svg" alt="AswitchI" class="about-hero-logo" />
          <div class="about-hero-text">
            <h3>AswitchI <span class="badge-version" id="about-version">v1.0.0</span></h3>
            <p class="about-sub">A switch between AI</p>
          </div>
        </div>

        <div class="about-card">
          <div class="about-row">
            <span class="about-label">🏢 Organization:</span>
            <span class="about-val"><strong>Lorapok Labs</strong> (Dhaka, Bangladesh)</span>
          </div>
          <div class="about-row">
            <span class="about-label">👤 Founder:</span>
            <span class="about-val"><strong>Mohammad Maizied Hasan Majumder</strong></span>
          </div>
          <div class="about-row">
            <span class="about-label">🌐 Ecosystem:</span>
            <span class="about-val">Lorapok Atlas, Media Player, ReportKit UI, Laravel Monitor, Linpad</span>
          </div>
        </div>

        <div class="about-description">
          <p>Developed by <strong>Lorapok Labs</strong> to provide developers on Linux with a fluid, high-performance macOS Launchpad experience for navigating AI IDEs, CLI autonomous agents, and persistent Web AIs.</p>
          <div style="margin-top: 15px; display: flex; gap: 10px; justify-content: center;">
            <button class="glass-btn" onclick="window.open('https://aswitchi.lorapok.tech')">Official Website</button>
          </div>
        </div>"""

text = re.sub(r'      <!-- Tab 2: About Lorapok Labs.*?</div>', replacement, text, flags=re.DOTALL)

with open("src/ui/launchpad.html", "w") as f:
    f.write(text)
