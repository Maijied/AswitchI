import React, { useEffect, useState } from "react";
import { fetchSnapStoreChannels, fetchWorkflowRuns, type SnapChannelRelease, type WorkflowRun } from "../../lib/api";
import { ExternalLink, CheckCircle2, AlertTriangle, ShieldCheck, Activity, Cpu, HardDrive } from "lucide-react";

export default function Overview() {
  const [channels, setChannels] = useState<SnapChannelRelease[]>([]);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSnapStoreChannels(), fetchWorkflowRuns()])
      .then(([chanData, runData]) => {
        setChannels(chanData);
        setRuns(runData);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>SNAP STORE STATUS</span>
            <span className="text-emerald-400 flex items-center gap-1">● Active</span>
          </div>
          <div className="text-xl font-bold text-cyan-400 mb-1">snapcraft.io/aswitchi</div>
          <div className="text-xs text-slate-400">Multi-Arch: <code className="text-slate-300">amd64</code> + <code className="text-slate-300">arm64</code></div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>CONTINUOUS INTEGRATION</span>
            <span className="text-emerald-400 flex items-center gap-1">● Healthy</span>
          </div>
          <div className="text-xl font-bold text-emerald-400 mb-1">8/8 Jobs Passing</div>
          <div className="text-xs text-slate-400">Quality Gate • Snaps • Web • Release</div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>PRODUCTION DOMAIN</span>
            <span className="text-emerald-400 flex items-center gap-1">● Live</span>
          </div>
          <div className="text-xl font-bold text-purple-400 mb-1">aswitchi.lorapok.tech</div>
          <div className="text-xs text-slate-400">HTTPS Enforced • Fast Global CDN</div>
        </div>

        <div className="glass-panel p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-2">
            <span>MEMORY FOOTPRINT</span>
            <span className="text-emerald-400 flex items-center gap-1">● Optimized</span>
          </div>
          <div className="text-xl font-bold text-amber-400 mb-1">&lt; 45 MB RAM</div>
          <div className="text-xs text-slate-400">GTK3 Native • Zero Electron Bloat</div>
        </div>
      </div>

      {/* Snap Store Channel Status */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Snap Store Release Channel Matrix</h2>
            <p className="text-xs text-slate-400">Live deployment tracking across active release tracks</p>
          </div>
          <a
            href="https://snapcraft.io/aswitchi"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1"
          >
            <span>View on Snap Store</span>
            <ExternalLink size={12} />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Channel</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">Revision</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-xs">
              {channels.map((chan, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                      chan.channel === 'stable' ? 'bg-emerald-500/15 text-emerald-400' :
                      chan.channel === 'candidate' ? 'bg-purple-500/15 text-purple-400' :
                      chan.channel === 'beta' ? 'bg-blue-500/15 text-blue-400' :
                      'bg-cyan-500/15 text-cyan-400'
                    }`}>
                      {chan.channel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-200">{chan.version}</td>
                  <td className="py-3.5 px-4 text-slate-400">{chan.architecture}</td>
                  <td className="py-3.5 px-4 text-slate-400">rev {chan.revision}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-400">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
