import React, { useState, useEffect } from "react";
import { 
  Rocket, 
  RotateCcw, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  ShieldAlert, 
  Play, 
  Terminal, 
  Key, 
  Sliders, 
  Lock 
} from "lucide-react";
import { 
  fetchWorkflowRuns, 
  dispatchGitHubWorkflow, 
  generateSnapcraftCommand, 
  WorkflowRun 
} from "../../lib/api";

export default function Deployments() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [operationType, setOperationType] = useState<"promote_release" | "progressive_release" | "rollback" | "close_channel">("promote_release");
  const [targetRevision, setTargetRevision] = useState("8");
  const [targetChannel, setTargetChannel] = useState<"stable" | "candidate" | "beta" | "edge">("stable");
  const [progressivePercent, setProgressivePercent] = useState("25");
  const [auditReason, setAuditReason] = useState("Production promotion via Mission Control");
  const [ghToken, setGhToken] = useState(localStorage.getItem("aswitchi_gh_pat") || "");
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [dispatching, setDispatching] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadRuns = async () => {
    setRefreshing(true);
    const data = await fetchWorkflowRuns();
    setRuns(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const saveToken = (token: string) => {
    setGhToken(token);
    localStorage.setItem("aswitchi_gh_pat", token);
  };

  const handleTriggerSnapOp = async () => {
    setDispatching(true);
    setMessage(null);

    const inputs = {
      operation: operationType,
      revision: targetRevision,
      channel: targetChannel,
      progressive_percentage: progressivePercent,
      reason: auditReason
    };

    const res = await dispatchGitHubWorkflow("snap-operations.yml", inputs, ghToken);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(loadRuns, 3000);
    } else {
      setMessage({ type: "error", text: res.message });
    }
    setDispatching(false);
  };

  const handleInstantRollback = async (rev: string) => {
    setDispatching(true);
    setMessage(null);

    const inputs = {
      operation: "rollback",
      revision: rev,
      channel: "stable",
      progressive_percentage: "100",
      reason: `Emergency Rollback to Revision ${rev} triggered by Master Admin`
    };

    const res = await dispatchGitHubWorkflow("snap-operations.yml", inputs, ghToken);

    if (res.success) {
      setMessage({ type: "success", text: `🚨 Emergency Rollback Dispatched: Channel 'stable' reverting to Revision ${rev}.` });
      setTimeout(loadRuns, 3000);
    } else {
      setMessage({ type: "error", text: res.message });
    }
    setDispatching(false);
  };

  const handleCopyCLI = () => {
    const cmd = generateSnapcraftCommand(operationType, targetRevision, targetChannel, progressivePercent);
    navigator.clipboard.writeText(cmd);
    setMessage({ type: "success", text: `✓ Copied CLI command to clipboard: ${cmd}` });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Mission Control Release & Rollback Center</h2>
          <p className="text-xs text-slate-400">Publish, phase, promote, or rollback Snap package revisions directly</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-purple-300 rounded-lg text-xs font-semibold border border-purple-500/30 transition-colors cursor-pointer"
          >
            <Key size={13} />
            <span>{ghToken ? "GitHub PAT Configured" : "Add GitHub PAT"}</span>
          </button>
          <button
            type="button"
            onClick={loadRuns}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* GitHub Token Config Box */}
      {showTokenInput && (
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-2">
          <div className="font-semibold text-purple-300 flex items-center gap-2">
            <Lock size={14} />
            <span>GitHub Personal Access Token (Workflow Dispatch Clearance)</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Store token locally in browser memory to trigger GitHub Actions dispatches directly from this UI.
          </p>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="ghp_..."
              value={ghToken}
              onChange={(e) => saveToken(e.target.value)}
              className="flex-1 bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-purple-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowTokenInput(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
          message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
          <div>
            <div className="font-semibold">{message.type === "success" ? "Operation Authorized" : "Operation Warning"}</div>
            <div className="mt-0.5 text-slate-300">{message.text}</div>
          </div>
        </div>
      )}

      {/* Main Control Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Snap Release & Promotion Controller */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Rocket size={16} className="text-cyan-400" />
              <span>Package Release Operations</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Admin Exclusive
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Target Operation
              </label>
              <select
                value={operationType}
                onChange={(e: any) => setOperationType(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
              >
                <option value="promote_release">Promote Revision to Channel (100%)</option>
                <option value="progressive_release">Progressive Phased Rollout (%)</option>
                <option value="rollback">Instant Rollback to Known-Good Revision</option>
                <option value="close_channel">Close / Freeze Channel</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Target Revision
                </label>
                <select
                  value={targetRevision}
                  onChange={(e) => setTargetRevision(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="8">Revision 8 (v1.0.0, Staged)</option>
                  <option value="7">Revision 7 (v1.0.0-rc1)</option>
                  <option value="5">Revision 5 (v1.0.0-beta.2)</option>
                  <option value="3">Revision 3 (v1.0.0-edge)</option>
                  <option value="2">Revision 2 (Initial Stable)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Destination Channel
                </label>
                <select
                  value={targetChannel}
                  onChange={(e: any) => setTargetChannel(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="stable">stable (Production)</option>
                  <option value="candidate">candidate (Pre-Release)</option>
                  <option value="beta">beta (Testing)</option>
                  <option value="edge">edge (Nightly)</option>
                </select>
              </div>
            </div>

            {operationType === "progressive_release" && (
              <div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
                  <span>Phased Rollout Target</span>
                  <span className="text-cyan-400">{progressivePercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="10"
                  value={progressivePercent}
                  onChange={(e) => setProgressivePercent(e.target.value)}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                Audit Reason / Release Note
              </label>
              <input
                type="text"
                value={auditReason}
                onChange={(e) => setAuditReason(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleTriggerSnapOp}
              disabled={dispatching}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold rounded-lg text-xs cursor-pointer transition-opacity disabled:opacity-50"
            >
              <Play size={14} />
              <span>{dispatching ? "Dispatching Operation..." : "Execute Release Operation"}</span>
            </button>
            <button
              type="button"
              onClick={handleCopyCLI}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 font-semibold rounded-lg text-xs border border-white/10 cursor-pointer"
            >
              <Terminal size={14} />
              <span>Copy CLI</span>
            </button>
          </div>
        </div>

        {/* Panel 2: Emergency Instant Rollback Safety Vault */}
        <div className="glass-panel p-6 space-y-4 border-rose-500/20 bg-rose-950/5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400" />
              <span>Emergency Rollback Safety Vault</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
              One-Click Recovery
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Instantly repoint the public <strong>stable</strong> channel to a verified previous revision if unexpected crashes or regressions occur in production.
          </p>

          <div className="space-y-2.5">
            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Revision 7 (v1.0.0-rc1)</div>
                <div className="text-[11px] text-slate-400">Tested Clean • amd64 & arm64</div>
              </div>
              <button
                type="button"
                onClick={() => handleInstantRollback("7")}
                disabled={dispatching}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>Rollback to Rev 7</span>
              </button>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Revision 5 (v1.0.0-beta.2)</div>
                <div className="text-[11px] text-slate-400">Baseline Multi-Arch • Stable</div>
              </div>
              <button
                type="button"
                onClick={() => handleInstantRollback("5")}
                disabled={dispatching}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>Rollback to Rev 5</span>
              </button>
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-white">Revision 2 (Initial Stable)</div>
                <div className="text-[11px] text-slate-400">Legacy Safe Fallback</div>
              </div>
              <button
                type="button"
                onClick={() => handleInstantRollback("2")}
                disabled={dispatching}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCcw size={13} />
                <span>Rollback to Rev 2</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CI/CD & Operations Run Log Table */}
      <div className="glass-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">GitHub Actions Workflow Audit Log</h3>
            <p className="text-xs text-slate-400">Live execution history of multi-arch builds and Snap release dispatches</p>
          </div>
          <a
            href="https://github.com/Maijied/AswitchI/actions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-cyan-400 hover:underline inline-flex items-center gap-1"
          >
            <span>GitHub Actions Dashboard</span>
            <ExternalLink size={12} />
          </a>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading audit history...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Run ID</th>
                  <th className="pb-3">Workflow Name</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Commit SHA</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {runs.map((run) => (
                  <tr key={run.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 text-slate-300">#{run.id}</td>
                    <td className="py-3 font-sans font-medium text-white">{run.name}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                        run.conclusion === "success" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" :
                        run.status === "in_progress" ? "bg-amber-500/15 text-amber-400 border border-amber-500/30 animate-pulse" :
                        "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      }`}>
                        ● {run.conclusion || run.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{run.head_sha}</td>
                    <td className="py-3 text-slate-400 font-sans">{new Date(run.created_at).toLocaleString()}</td>
                    <td className="py-3 text-right font-sans">
                      <a
                        href={run.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Logs</span>
                        <ExternalLink size={11} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
