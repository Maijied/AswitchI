#!/usr/bin/env python3
"""
Generate High-Definition, Ultra-Crisp UI Showcase Graphics for AswitchI
Renders vector SVG designs into high-resolution PNGs via rsvg-convert.
"""

import os
import subprocess

ASSETS_DIR = "/tmp/AswitchI/assets"
WEBSITE_ASSETS_DIR = "/tmp/AswitchI/website/assets"

def render_svg_to_png(svg_string: str, base_name: str, width: int = 1600, height: int = 900):
    svg_path = os.path.join(ASSETS_DIR, f"{base_name}.svg")
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_string)
    
    png_path_1 = os.path.join(ASSETS_DIR, f"{base_name}.png")
    png_path_2 = os.path.join(WEBSITE_ASSETS_DIR, f"{base_name}.png")
    
    subprocess.run(["rsvg-convert", "-w", str(width), "-h", str(height), svg_path, "-o", png_path_1], check=True)
    subprocess.run(["rsvg-convert", "-w", str(width), "-h", str(height), svg_path, "-o", png_path_2], check=True)
    print(f"✓ Generated HD Showcase: {png_path_1} and {png_path_2} ({width}x{height})")

def generate_hero_showcase():
    return '''<svg width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Space Grotesk', sans-serif">
  <defs>
    <radialGradient id="bgGlow1" cx="20%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#050814" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bgGlow2" cx="80%" cy="80%" r="60%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#050814" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0e172e" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#080c1a" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="1600" height="900" fill="#04060d"/>
  <rect width="1600" height="900" fill="url(#bgGlow1)"/>
  <rect width="1600" height="900" fill="url(#bgGlow2)"/>

  <!-- Window Container -->
  <rect x="60" y="40" width="1480" height="820" rx="24" fill="#070b18" fill-opacity="0.85" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" filter="url(#dropShadow)"/>

  <!-- Window Header / Topbar -->
  <g transform="translate(60, 40)">
    <!-- Traffic lights -->
    <circle cx="36" cy="32" r="6.5" fill="#f43f5e" opacity="0.9"/>
    <circle cx="56" cy="32" r="6.5" fill="#f59e0b" opacity="0.9"/>
    <circle cx="76" cy="32" r="6.5" fill="#10b981" opacity="0.9"/>

    <!-- Search Bar -->
    <rect x="440" y="14" width="600" height="38" rx="19" fill="#030611" stroke="rgba(0,242,254,0.4)" stroke-width="1.5"/>
    <path d="M465 33 L472 40 M476 30 A 6 6 0 1 1 464 30 A 6 6 0 1 1 476 30" stroke="#00f2fe" stroke-width="2" fill="none" opacity="0.8"/>
    <text x="490" y="38" fill="#e2e8f0" font-size="14" font-weight="500">Search 22 AI IDEs, CLI Agents, Web AIs, and Projects...</text>
    <rect x="990" y="22" width="36" height="22" rx="6" fill="rgba(255,255,255,0.1)"/>
    <text x="1008" y="37" fill="#94a3b8" font-size="11" font-weight="700" text-anchor="middle">ESC</text>

    <!-- Top-Right System Telemetry -->
    <rect x="1300" y="18" width="140" height="28" rx="14" fill="#0c1328" stroke="rgba(255,255,255,0.08)"/>
    <circle cx="1318" cy="32" r="4" fill="#10b981"/>
    <text x="1330" y="36" fill="#94a3b8" font-size="11" font-weight="600">RAM: 42.4 MB</text>
  </g>

  <!-- Category Pills Filter Bar -->
  <g transform="translate(100, 115)">
    <!-- Pill 1: All Active -->
    <rect x="0" y="0" width="90" height="32" rx="16" fill="url(#brandGrad)"/>
    <text x="45" y="20" fill="#04060d" font-size="12" font-weight="700" text-anchor="middle">All (22)</text>

    <!-- Pill 2: IDEs -->
    <rect x="102" y="0" width="96" height="32" rx="16" fill="#0f172a" stroke="rgba(255,255,255,0.1)"/>
    <text x="150" y="20" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">IDEs (4)</text>

    <!-- Pill 3: CLI Agents -->
    <rect x="210" y="0" width="130" height="32" rx="16" fill="#0f172a" stroke="rgba(255,255,255,0.1)"/>
    <text x="275" y="20" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">CLI Agents (5)</text>

    <!-- Pill 4: Web AIs -->
    <rect x="352" y="0" width="118" height="32" rx="16" fill="#0f172a" stroke="rgba(255,255,255,0.1)"/>
    <text x="411" y="20" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Web AIs (8)</text>

    <!-- Pill 5: Projects -->
    <rect x="482" y="0" width="124" height="32" rx="16" fill="#0f172a" stroke="rgba(255,255,255,0.1)"/>
    <text x="544" y="20" fill="#cbd5e1" font-size="12" font-weight="600" text-anchor="middle">Projects (53)</text>
  </g>

  <!-- Launchpad Grid of Apps (4 cols x 2 rows) -->
  <g transform="translate(100, 175)">
    <!-- App 1: Cursor IDE (ACTIVE) -->
    <g transform="translate(0, 0)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="#00f2fe" stroke-width="1.5" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#050a1c" stroke="rgba(0,242,254,0.4)" stroke-width="1"/>
      <polygon points="33,28 33,54 44,46 52,56 55,54 47,44 57,44" fill="#00f2fe"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Cursor IDE</text>
      <text x="85" y="58" fill="#00f2fe" font-size="11" font-weight="600">DESKTOP IDE</text>
      <rect x="220" y="20" width="85" height="24" rx="12" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1"/>
      <circle cx="232" cy="32" r="3.5" fill="#10b981"/>
      <text x="240" y="36" fill="#10b981" font-size="10" font-weight="700">RUNNING</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">AI Code Editor bridge with background process detection.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#38bdf8" font-size="11" font-family="monospace">$ cursor /mnt/Personal_Projects</text>
    </g>

    <!-- App 2: Google Antigravity (ACTIVE CLI AGENT) -->
    <g transform="translate(360, 0)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="#a855f7" stroke-width="1.5" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#0d051c" stroke="rgba(168,85,247,0.4)" stroke-width="1"/>
      <circle cx="43" cy="43" r="16" fill="none" stroke="#a855f7" stroke-width="2.5"/>
      <polygon points="43,33 50,47 36,47" fill="#a855f7"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Antigravity CLI</text>
      <text x="85" y="58" fill="#a855f7" font-size="11" font-weight="600">CLI AGENT</text>
      <rect x="220" y="20" width="85" height="24" rx="12" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1"/>
      <circle cx="232" cy="32" r="3.5" fill="#10b981"/>
      <text x="240" y="36" fill="#10b981" font-size="10" font-weight="700">ACTIVE</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Autonomous paired AI engineer with MCP tool integration.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#c084fc" font-size="11" font-family="monospace">$ agy --goal "Optimize App"</text>
    </g>

    <!-- App 3: Claude 3.7 Sonnet (WEB AI) -->
    <g transform="translate(720, 0)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#180e06" stroke="rgba(249,115,22,0.4)" stroke-width="1"/>
      <circle cx="43" cy="43" r="14" fill="#f97316"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Claude 3.7</text>
      <text x="85" y="58" fill="#f97316" font-size="11" font-weight="600">PERSISTENT WEB AI</text>
      <rect x="225" y="20" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <circle cx="237" cy="32" r="3.5" fill="#38bdf8"/>
      <text x="246" y="36" fill="#e2e8f0" font-size="10" font-weight="700">STANDBY</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Deep Reasoning &amp; code analysis in isolated WebKit sandbox.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#fb923c" font-size="11" font-family="monospace">https://claude.ai</text>
    </g>

    <!-- App 4: Windsurf IDE -->
    <g transform="translate(1080, 0)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#06161c" stroke="rgba(6,182,212,0.4)" stroke-width="1"/>
      <path d="M30 43 Q43 28 56 43 Q43 58 30 43" fill="none" stroke="#06b6d4" stroke-width="3"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Windsurf IDE</text>
      <text x="85" y="58" fill="#06b6d4" font-size="11" font-weight="600">DESKTOP IDE</text>
      <rect x="225" y="20" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <circle cx="237" cy="32" r="3.5" fill="#38bdf8"/>
      <text x="246" y="36" fill="#e2e8f0" font-size="10" font-weight="700">STANDBY</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Codeium AI Studio with flow agentic architecture.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#22d3ee" font-size="11" font-family="monospace">$ windsurf .</text>
    </g>

    <!-- Row 2 -->
    <!-- App 5: Cline Terminal Agent -->
    <g transform="translate(0, 215)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#0c1706" stroke="rgba(34,197,94,0.4)" stroke-width="1"/>
      <text x="43" y="50" fill="#22c55e" font-size="24" font-weight="900" text-anchor="middle">&gt;_</text>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Cline / Roo</text>
      <text x="85" y="58" fill="#22c55e" font-size="11" font-weight="600">CLI AGENT</text>
      <rect x="225" y="20" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <circle cx="237" cy="32" r="3.5" fill="#38bdf8"/>
      <text x="246" y="36" fill="#e2e8f0" font-size="10" font-weight="700">STANDBY</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Autonomous CLI agent with interactive tool approval.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#4ade80" font-size="11" font-family="monospace">$ cline --model claude-3-7</text>
    </g>

    <!-- App 6: ChatGPT 4o -->
    <g transform="translate(360, 215)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#061713" stroke="rgba(16,185,129,0.4)" stroke-width="1"/>
      <circle cx="43" cy="43" r="14" fill="#10b981"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">ChatGPT 4o</text>
      <text x="85" y="58" fill="#10b981" font-size="11" font-weight="600">PERSISTENT WEB AI</text>
      <rect x="225" y="20" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <circle cx="237" cy="32" r="3.5" fill="#38bdf8"/>
      <text x="246" y="36" fill="#e2e8f0" font-size="10" font-weight="700">STANDBY</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Canvas collaboration and voice synthesis.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#34d399" font-size="11" font-family="monospace">https://chatgpt.com</text>
    </g>

    <!-- App 7: Perplexity AI -->
    <g transform="translate(720, 215)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#08151c" stroke="rgba(56,189,248,0.4)" stroke-width="1"/>
      <polygon points="43,30 55,50 31,50" fill="none" stroke="#38bdf8" stroke-width="2.5"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Perplexity AI</text>
      <text x="85" y="58" fill="#38bdf8" font-size="11" font-weight="600">PERSISTENT WEB AI</text>
      <rect x="225" y="20" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <circle cx="237" cy="32" r="3.5" fill="#38bdf8"/>
      <text x="246" y="36" fill="#e2e8f0" font-size="10" font-weight="700">STANDBY</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Real-time academic &amp; web search synthesis engine.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#38bdf8" font-size="11" font-family="monospace">https://perplexity.ai</text>
    </g>

    <!-- App 8: Google Gemini Pro -->
    <g transform="translate(1080, 215)">
      <rect width="320" height="190" rx="18" fill="url(#cardGrad)" stroke="rgba(255,255,255,0.1)" stroke-width="1.2" filter="url(#dropShadow)"/>
      <rect x="15" y="15" width="56" height="56" rx="14" fill="#0a0a20" stroke="rgba(99,102,241,0.4)" stroke-width="1"/>
      <path d="M43 27 Q43 43 59 43 Q43 43 43 59 Q43 43 27 43 Q43 43 43 27" fill="#6366f1"/>
      <text x="85" y="38" fill="#ffffff" font-size="17" font-weight="700">Gemini 2.0</text>
      <text x="85" y="58" fill="#818cf8" font-size="11" font-weight="600">PERSISTENT WEB AI</text>
      <rect x="225" y="20" width="80" height="24" rx="12" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)"/>
      <circle cx="237" cy="32" r="3.5" fill="#38bdf8"/>
      <text x="246" y="36" fill="#e2e8f0" font-size="10" font-weight="700">STANDBY</text>
      <text x="20" y="115" fill="#94a3b8" font-size="12">Multimodal 2M token context window explorer.</text>
      <rect x="20" y="145" width="280" height="28" rx="8" fill="#02040a" stroke="rgba(255,255,255,0.06)"/>
      <text x="32" y="163" fill="#a5b4fc" font-size="11" font-family="monospace">https://gemini.google.com</text>
    </g>
  </g>

  <!-- Bottom 3D Floating Glass Dock -->
  <g transform="translate(480, 750)">
    <!-- Dock Outer Glass Base with Reflection -->
    <rect width="640" height="85" rx="22" fill="#0a1024" fill-opacity="0.85" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#dropShadow)"/>
    <rect x="5" y="5" width="630" height="38" rx="18" fill="rgba(255,255,255,0.04)"/>

    <!-- Dock Icons (7 items) -->
    <!-- 1: AswitchI Logo Pin -->
    <g transform="translate(35, 16)">
      <circle cx="26" cy="26" r="24" fill="url(#brandGrad)"/>
      <text x="26" y="34" fill="#ffffff" font-size="20" font-weight="900" text-anchor="middle">A</text>
      <circle cx="26" cy="58" r="3" fill="#00f2fe"/>
    </g>

    <!-- 2: Cursor (Active) -->
    <g transform="translate(115, 16)">
      <rect width="52" height="52" rx="13" fill="#050a1c" stroke="#00f2fe" stroke-width="1.5"/>
      <polygon points="21,15 21,37 30,30 37,39 39,37 32,28 41,28" fill="#00f2fe"/>
      <circle cx="26" cy="58" r="3" fill="#10b981"/>
    </g>

    <!-- 3: Antigravity CLI (Active) -->
    <g transform="translate(195, 16)">
      <rect width="52" height="52" rx="13" fill="#0d051c" stroke="#a855f7" stroke-width="1.5"/>
      <polygon points="26,18 34,34 18,34" fill="#a855f7"/>
      <circle cx="26" cy="58" r="3" fill="#10b981"/>
    </g>

    <!-- 4: Claude -->
    <g transform="translate(275, 16)">
      <rect width="52" height="52" rx="13" fill="#180e06" stroke="rgba(249,115,22,0.5)" stroke-width="1.2"/>
      <circle cx="26" cy="26" r="14" fill="#f97316"/>
    </g>

    <!-- 5: ChatGPT -->
    <g transform="translate(355, 16)">
      <rect width="52" height="52" rx="13" fill="#061713" stroke="rgba(16,185,129,0.5)" stroke-width="1.2"/>
      <circle cx="26" cy="26" r="14" fill="#10b981"/>
    </g>

    <!-- 6: Windsurf -->
    <g transform="translate(435, 16)">
      <rect width="52" height="52" rx="13" fill="#06161c" stroke="rgba(6,182,212,0.5)" stroke-width="1.2"/>
      <path d="M16 26 Q26 14 36 26 Q26 38 16 26" fill="none" stroke="#06b6d4" stroke-width="2.5"/>
    </g>

    <!-- 7: Terminal / System Projects -->
    <g transform="translate(515, 16)">
      <rect width="52" height="52" rx="13" fill="#0c1706" stroke="rgba(34,197,94,0.5)" stroke-width="1.2"/>
      <text x="26" y="34" fill="#22c55e" font-size="20" font-weight="900" text-anchor="middle">&gt;_</text>
    </g>

    <!-- Divider & Settings -->
    <line x1="590" y1="20" x2="590" y2="65" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
    <g transform="translate(605, 34)">
      <circle cx="10" cy="10" r="8" fill="none" stroke="#94a3b8" stroke-width="2"/>
    </g>
  </g>
</svg>'''

def generate_dock_showcase():
    return '''<svg width="1600" height="480" viewBox="0 0 1600 480" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif">
  <defs>
    <radialGradient id="dockGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00f2fe" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#04060d" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <rect width="1600" height="480" fill="#04060d"/>
  <rect width="1600" height="480" fill="url(#dockGlow)"/>

  <!-- Dock Title -->
  <text x="800" y="80" fill="#ffffff" font-size="26" font-weight="800" text-anchor="middle">Interactive 3D Glass Dock System</text>
  <text x="800" y="112" fill="#94a3b8" font-size="14" font-weight="500" text-anchor="middle">Spring physics magnification, running process indicators, and instant pin-to-dock toggling</text>

  <!-- Big Dock Container -->
  <g transform="translate(300, 180)">
    <rect width="1000" height="130" rx="30" fill="#0a1228" fill-opacity="0.9" stroke="rgba(255,255,255,0.18)" stroke-width="2" filter="url(#shadow)"/>
    <rect x="8" y="8" width="984" height="56" rx="24" fill="rgba(255,255,255,0.03)"/>

    <!-- App 1: AswitchI Main (Pin) -->
    <g transform="translate(60, 22)">
      <circle cx="42" cy="42" r="38" fill="url(#brandGrad)"/>
      <text x="42" y="54" fill="#ffffff" font-size="30" font-weight="900" text-anchor="middle">A</text>
      <circle cx="42" cy="94" r="4.5" fill="#00f2fe"/>
      <text x="42" y="-12" fill="#e2e8f0" font-size="12" font-weight="700" text-anchor="middle">AswitchI</text>
    </g>

    <!-- App 2: Cursor (RUNNING) -->
    <g transform="translate(180, 22)">
      <rect width="84" height="84" rx="20" fill="#050a1c" stroke="#00f2fe" stroke-width="2"/>
      <polygon points="34,24 34,60 48,48 60,62 64,58 52,44 68,44" fill="#00f2fe"/>
      <circle cx="42" cy="94" r="4.5" fill="#10b981"/>
      <text x="42" y="-12" fill="#00f2fe" font-size="12" font-weight="700" text-anchor="middle">Cursor IDE</text>
    </g>

    <!-- App 3: Antigravity CLI (RUNNING) -->
    <g transform="translate(300, 22)">
      <rect width="84" height="84" rx="20" fill="#0d051c" stroke="#a855f7" stroke-width="2"/>
      <polygon points="42,28 56,54 28,54" fill="#a855f7"/>
      <circle cx="42" cy="94" r="4.5" fill="#10b981"/>
      <text x="42" y="-12" fill="#c084fc" font-size="12" font-weight="700" text-anchor="middle">Antigravity</text>
    </g>

    <!-- App 4: Claude 3.7 -->
    <g transform="translate(420, 22)">
      <rect width="84" height="84" rx="20" fill="#180e06" stroke="rgba(249,115,22,0.6)" stroke-width="1.8"/>
      <circle cx="42" cy="42" r="22" fill="#f97316"/>
      <text x="42" y="-12" fill="#fed7aa" font-size="12" font-weight="600" text-anchor="middle">Claude 3.7</text>
    </g>

    <!-- App 5: ChatGPT -->
    <g transform="translate(540, 22)">
      <rect width="84" height="84" rx="20" fill="#061713" stroke="rgba(16,185,129,0.6)" stroke-width="1.8"/>
      <circle cx="42" cy="42" r="22" fill="#10b981"/>
      <text x="42" y="-12" fill="#a7f3d0" font-size="12" font-weight="600" text-anchor="middle">ChatGPT 4o</text>
    </g>

    <!-- App 6: Windsurf -->
    <g transform="translate(660, 22)">
      <rect width="84" height="84" rx="20" fill="#06161c" stroke="rgba(6,182,212,0.6)" stroke-width="1.8"/>
      <path d="M26 42 Q42 22 58 42 Q42 62 26 42" fill="none" stroke="#06b6d4" stroke-width="3.5"/>
      <text x="42" y="-12" fill="#a5f3fc" font-size="12" font-weight="600" text-anchor="middle">Windsurf</text>
    </g>

    <!-- App 7: Terminal -->
    <g transform="translate(780, 22)">
      <rect width="84" height="84" rx="20" fill="#0c1706" stroke="rgba(34,197,94,0.6)" stroke-width="1.8"/>
      <text x="42" y="52" fill="#22c55e" font-size="32" font-weight="900" text-anchor="middle">&gt;_</text>
      <text x="42" y="-12" fill="#bbf7d0" font-size="12" font-weight="600" text-anchor="middle">Terminal</text>
    </g>

    <!-- Divider -->
    <line x1="895" y1="28" x2="895" y2="100" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>

    <!-- Settings / Quit -->
    <g transform="translate(925, 45)">
      <circle cx="20" cy="20" r="16" fill="none" stroke="#94a3b8" stroke-width="3"/>
      <text x="20" y="-35" fill="#94a3b8" font-size="12" font-weight="600" text-anchor="middle">Quit</text>
    </g>
  </g>
</svg>'''

def generate_webai_showcase():
    return '''<svg width="1600" height="900" viewBox="0 0 1600 900" xmlns="http://www.w3.org/2000/svg" font-family="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', sans-serif">
  <defs>
    <radialGradient id="webGlow" cx="20%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f97316" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#04060d" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.7"/>
    </filter>
  </defs>

  <rect width="1600" height="900" fill="#04060d"/>
  <rect width="1600" height="900" fill="url(#webGlow)"/>

  <!-- Window Container -->
  <rect x="80" y="60" width="1440" height="780" rx="24" fill="#0b0f19" fill-opacity="0.95" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" filter="url(#shadow)"/>

  <!-- Topbar Header -->
  <g transform="translate(80, 60)">
    <circle cx="36" cy="30" r="6" fill="#f43f5e"/>
    <circle cx="54" cy="30" r="6" fill="#f59e0b"/>
    <circle cx="72" cy="30" r="6" fill="#10b981"/>

    <!-- URL Bar -->
    <rect x="360" y="12" width="720" height="36" rx="18" fill="#030611" stroke="rgba(249,115,22,0.4)" stroke-width="1.5"/>
    <circle cx="385" cy="30" r="4" fill="#10b981"/>
    <text x="400" y="35" fill="#fed7aa" font-size="13" font-family="monospace">https://claude.ai/chat/aswitchi-native-session</text>
    <rect x="1000" y="18" width="65" height="24" rx="6" fill="#f97316" fill-opacity="0.2"/>
    <text x="1032" y="34" fill="#f97316" font-size="11" font-weight="700" text-anchor="middle">ISOLATED</text>

    <!-- Memory Footprint Badge -->
    <rect x="1270" y="16" width="130" height="28" rx="14" fill="#180e06" stroke="rgba(249,115,22,0.3)"/>
    <circle cx="1288" cy="30" r="3.5" fill="#f97316"/>
    <text x="1300" y="34" fill="#fed7aa" font-size="11" font-weight="700">WebKit2GTK Engine</text>
  </g>

  <!-- Web Content Simulation -->
  <g transform="translate(130, 140)">
    <!-- Sidebar -->
    <rect width="260" height="660" rx="16" fill="#070a14" stroke="rgba(255,255,255,0.06)"/>
    <text x="24" y="45" fill="#ffffff" font-size="16" font-weight="700">Recent Chats</text>
    <rect x="16" y="70" width="228" height="42" rx="10" fill="#180e06" stroke="rgba(249,115,22,0.3)"/>
    <text x="32" y="96" fill="#fed7aa" font-size="13" font-weight="600">AswitchI Linux Bridge</text>

    <rect x="16" y="125" width="228" height="38" rx="10" fill="rgba(255,255,255,0.02)"/>
    <text x="32" y="149" fill="#94a3b8" font-size="13">GTK3 WebKit Optimizations</text>

    <rect x="16" y="175" width="228" height="38" rx="10" fill="rgba(255,255,255,0.02)"/>
    <text x="32" y="199" fill="#94a3b8" font-size="13">Antigravity CLI Hooks</text>

    <!-- Main Chat Pane -->
    <g transform="translate(290, 0)">
      <rect width="1050" height="660" rx="16" fill="#050812" stroke="rgba(255,255,255,0.06)"/>

      <!-- User Bubble -->
      <rect x="450" y="35" width="560" height="70" rx="16" fill="#1e293b" stroke="rgba(255,255,255,0.1)"/>
      <text x="475" y="65" fill="#f8fafc" font-size="14" font-weight="500">How does AswitchI eliminate memory bloat compared to Electron?</text>
      <text x="475" y="88" fill="#94a3b8" font-size="12">10:42 AM · Sent via Native Linux Launchpad</text>

      <!-- Assistant Bubble -->
      <rect x="40" y="130" width="970" height="420" rx="16" fill="#111827" stroke="rgba(249,115,22,0.2)"/>
      <circle cx="70" cy="165" r="16" fill="#f97316"/>
      <text x="70" y="171" fill="#ffffff" font-size="14" font-weight="800" text-anchor="middle">C</text>
      <text x="100" y="170" fill="#f97316" font-size="15" font-weight="700">Claude 3.7 Sonnet (Reasoning Model)</text>

      <text x="70" y="220" fill="#e2e8f0" font-size="14" font-weight="600">AswitchI achieves &lt; 45 MB RAM usage by utilizing native Linux shared libraries:</text>
      
      <text x="70" y="260" fill="#cbd5e1" font-size="13">1. <tspan font-weight="700" fill="#38bdf8">Zero Chromium Duplication:</tspan> Instead of shipping a 150MB+ bundled Chromium binary per app, it shares the system's libwebkit2gtk runtime.</text>
      <text x="70" y="300" fill="#cbd5e1" font-size="13">2. <tspan font-weight="700" fill="#10b981">Hardware Surface Composition:</tspan> GTK3 handles native window layering with compositor acceleration on Wayland/X11.</text>
      <text x="70" y="340" fill="#cbd5e1" font-size="13">3. <tspan font-weight="700" fill="#c084fc">Isolated Profile Keyring:</tspan> Persistent login cookies and tokens reside securely in ~/.config/aswitchi/webai-profile.</text>

      <!-- Code Snippet inside chat -->
      <rect x="70" y="375" width="910" height="145" rx="10" fill="#030712" stroke="rgba(255,255,255,0.08)"/>
      <text x="95" y="405" fill="#38bdf8" font-size="12" font-family="monospace"># Zero electron bloat - Native GTK3 invocation</text>
      <text x="95" y="430" fill="#e2e8f0" font-size="12" font-family="monospace">$ aswitchi --launch "Claude 3.7" --session isolated</text>
      <text x="95" y="455" fill="#10b981" font-size="12" font-family="monospace">[AswitchI] WebKit2GTK viewport created in 42ms (RAM: 38.6 MB)</text>
      <text x="95" y="480" fill="#94a3b8" font-size="12" font-family="monospace">[AswitchI] Native session active and connected to host desktop dock.</text>

      <!-- Bottom Chat Input Bar -->
      <rect x="40" y="575" width="970" height="55" rx="16" fill="#030712" stroke="rgba(249,115,22,0.4)" stroke-width="1.5"/>
      <text x="70" y="608" fill="#94a3b8" font-size="14">Ask Claude anything or invoke /execute command...</text>
      <rect x="945" y="585" width="50" height="35" rx="10" fill="#f97316"/>
      <polygon points="965,597 975,602 965,608" fill="#ffffff"/>
    </g>
  </g>
</svg>'''

def main():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    os.makedirs(WEBSITE_ASSETS_DIR, exist_ok=True)

    # 1. Hero Showcase
    hero_svg = generate_hero_showcase()
    render_svg_to_png(hero_svg, "hero_showcase", 1600, 900)

    # 2. Dock Showcase
    dock_svg = generate_dock_showcase()
    render_svg_to_png(dock_svg, "dock_strip", 1600, 480)

    # 3. Web AI Showcase
    webai_svg = generate_webai_showcase()
    render_svg_to_png(webai_svg, "webai_view", 1600, 900)

if __name__ == "__main__":
    main()
