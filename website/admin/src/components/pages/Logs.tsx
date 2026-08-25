import React, { useState } from "react";
import { Terminal, Trash2 } from "lucide-react";

export default function Logs() {
  const [logs, setLogs] = useState([
    { id: 1, time: "06:40:02", text: "[SYSTEM] AswitchI Mission Control initialized on React 18 / Vite engine.", type: "info" },
    { id: 2, time: "06:40:05", text: "[AUTH] Master Administrator verified: mdshuvo40@gmail.com (Full Clearance).", type: "success" },
    { id: 3, time: "06:40:07", text: "[SNAP] Live channels synchronized with Canonical Snapcraft Store API v2.", type: "info" },
    { id: 4, time: "06:40:12", text: "[PIPELINE] Multi-architecture CI/CD workflow run #32794745829 passing.", type: "success" },
    { id: 5, time: "06:40:18", text: "[KEYRING] WebKit2GTK isolated cookie vault active at ~/.config/aswitchi/webai-profile.", type: "info" }
  ]);

  const clearLogs = () => {
    setLogs([{ id: Date.now(), time: new Date().toLocaleTimeString(), text: "[SYSTEM] Log view cleared.", type: "info" }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Security & Operation Audit Terminal</h2>
          <p className="text-xs text-slate-400">Timestamped event log for deployments, auth sessions, and release actions</p>
        </div>
        <button
          type="button"
          onClick={clearLogs}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <Trash2 size={13} />
          <span>Clear View</span>
        </button>
      </div>

      <div className="bg-[#02040a] border border-white/10 rounded-xl p-5 font-mono text-xs max-h-[500px] overflow-y-auto space-y-2">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 leading-relaxed">
            <span className="text-slate-500 shrink-0">[{log.time}]</span>
            <span className={log.type === "success" ? "text-emerald-400" : log.type === "warn" ? "text-amber-400" : "text-slate-300"}>
              {log.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
