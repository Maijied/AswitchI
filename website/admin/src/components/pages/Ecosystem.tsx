import React from "react";
import { Laptop, Terminal, Globe, FolderGit2 } from "lucide-react";

export default function Ecosystem() {
  const desktopApps = [
    { name: "Cursor IDE", type: "Desktop IDE", cmd: "cursor", desc: "Native AI Code Editor bridge with background process detection." },
    { name: "Windsurf IDE", type: "Desktop IDE", cmd: "windsurf", desc: "Codeium AI Development Studio." },
    { name: "Kiro IDE", type: "Desktop IDE", cmd: "kiro", desc: "Custom AI Coding Interface." },
    { name: "Claude Desktop", type: "Desktop IDE", cmd: "claude-desktop", desc: "Anthropic native desktop client." }
  ];

  const cliAgents = [
    { name: "Google Antigravity", type: "CLI Agent", cmd: "agy", desc: "Autonomous agentic coding framework." },
    { name: "Cline / Roo-Code", type: "CLI Agent", cmd: "cline", desc: "Autonomous terminal coder with safety hooks." },
    { name: "Aider AI", type: "CLI Agent", cmd: "aider", desc: "Terminal paired programming AI." },
    { name: "Devin CLI", type: "CLI Agent", cmd: "devin", desc: "Autonomous software development engine." }
  ];

  const webAis = [
    { name: "Claude 3.7 Sonnet", type: "Web AI", url: "https://claude.ai", desc: "Anthropic flagship reasoning & code generation." },
    { name: "ChatGPT 4o", type: "Web AI", url: "https://chatgpt.com", desc: "OpenAI Canvas & Advanced Voice Engine." },
    { name: "Google Gemini", type: "Web AI", url: "https://gemini.google.com", desc: "Deep Research and 2M token context." },
    { name: "Google AI Studio", type: "Web AI", url: "https://aistudio.google.com", desc: "Gemini Pro / Flash developer playground." },
    { name: "Perplexity AI", type: "Web AI", url: "https://www.perplexity.ai", desc: "Real-time AI search & citation explorer." },
    { name: "DeepSeek Chat", type: "Web AI", url: "https://chat.deepseek.com", desc: "DeepSeek V3 and R1 reasoning engines." },
    { name: "v0 by Vercel", type: "Web AI", url: "https://v0.dev", desc: "Generative UI for React and Next.js." }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">AI Ecosystem & Discovery Hub</h2>
        <p className="text-xs text-slate-400">Autodiscovered desktop IDEs, terminal CLI agents, and WebKit2GTK sandboxed Web AIs</p>
      </div>

      {/* Desktop IDEs */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Laptop size={14} />
          <span>Desktop AI IDEs</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {desktopApps.map((app, idx) => (
            <div key={idx} className="glass-panel p-4 space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300">
                {app.type}
              </span>
              <h4 className="text-sm font-bold text-white">{app.name}</h4>
              <p className="text-xs text-slate-400">{app.desc}</p>
              <div className="text-[11px] font-mono text-cyan-400 bg-black/40 px-2 py-1 rounded">
                ${app.cmd}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CLI Agents */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Terminal size={14} />
          <span>CLI AI Agents</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cliAgents.map((agent, idx) => (
            <div key={idx} className="glass-panel p-4 space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                {agent.type}
              </span>
              <h4 className="text-sm font-bold text-white">{agent.name}</h4>
              <p className="text-xs text-slate-400">{agent.desc}</p>
              <div className="text-[11px] font-mono text-cyan-400 bg-black/40 px-2 py-1 rounded">
                ${agent.cmd}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Web AIs */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Globe size={14} />
          <span>Persistent Web AIs (WebKit2GTK Sandbox)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {webAis.map((web, idx) => (
            <div key={idx} className="glass-panel p-4 space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                {web.type}
              </span>
              <h4 className="text-sm font-bold text-white">{web.name}</h4>
              <p className="text-xs text-slate-400">{web.desc}</p>
              <div className="text-[11px] font-mono text-slate-300 truncate">
                {web.url}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
