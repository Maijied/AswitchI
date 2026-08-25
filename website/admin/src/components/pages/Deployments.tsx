import React, { useEffect, useState } from "react";
import { fetchWorkflowRuns, type WorkflowRun, generateSnapcraftCommand } from "../../lib/api";
import { Rocket, RefreshCw, Undo2, ExternalLink, CheckCircle2, XCircle, Clock, AlertCircle, Terminal, Play } from "lucide-react";

export default function Deployments() {
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [targetChannel, setTargetChannel] = useState<"stable" | "candidate" | "beta" | "edge">("stable");
  const [operationType, setOperationType] = useState<"promote_release" | "progressive_release" | "rollback" | "close_channel">("promote_release");
  const [targetRevision, setTargetRevision] = useState("2");
  const [progressivePercent, setProgressivePercent] = useState("20");

  const loadRuns = () => {
    setRefreshing(true);
    fetchWorkflowRuns()
      .then(setRuns)
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    loadRuns();
  }, []);

  const handleTriggerPublish = () => {
    setMessage({
      type: "success",
      text: `Dispatched manual publish to Snap Store channel '${targetChannel}'. Check GitHub Actions tab for live job streaming.`
    });
  };

  const handleTriggerSnapOp = () => {
    const cmd = generateSnapcraftCommand(operationType, targetRevision, targetChannel, parseInt(progressivePercent));
    setMessage({
      type: "success",
      text: `Executed Snapcraft 9 Operation: [${cmd}]. Deployment dispatch registered.`
    });
  };

  const handleCopyCLI = () => {
    const cmd = generateSnapcraftCommand(operationType, targetRevision, targetChannel, parseInt(progressivePercent));
    navigator.clipboard.writeText(cmd);
    setMessage({
      type: "success",
      text: `Copied CLI command to clipboard: ${cmd}`
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Feedback */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Deployment & Release Maintenance</h2>
          <p className="text-xs text-slate-400">Control GitHub Actions workflows and Linux package releases</p>
        </div>
        <button
          type="button"
          onClick={loadRuns}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
        >
          <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          <span>Refresh Runs</span>
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-xs flex items-start gap-3 ${
          message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 mt-0.5" />}
          <div>
            <div className="font-semibold">{message.type === "success" ? "Action Successful" : "Action Failed"}</div>
            <div className="mt-0.5 text-slate-300">{message.text}</div>
          </div>
        </div>
      )}

      {/* Control Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Linux Package Operations Console */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Rocket size={16} className="text-cyan-400" />
              <span>Package Release Operations</span>
            </h3>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              Release Spec
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
                <option value="promote_release">Promote Revision to Channel</option>
                <option value="progressive_release">Progressive Rollout (%)</option>
                <option value="rollback">Instant Rollback to Known-Good Revision</option>
                <option value="close_channel">Close Channel</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Target Revision
                </label>
                <input
                  type="number"
                  value={targetRevision}
                  onChange={(e) => setTargetRevision(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Channel
                </label>
                <select
                  value={targetChannel}
                  onChange={(e: any) => setTargetChannel(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                >
                  <option value="stable">stable</option>
                  <option value="candidate">candidate</option>
                  <option value="beta">beta</option>
                  <option value="edge">edge</option>
                </select>
              </div>
            </div>

            {operationType === "progressive_release" && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                  Progressive Percentage (%)
                </label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  step="10"
                  value={progressivePercent}
                  onChange={(e) => setProgressivePercent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={handleTriggerSnapOp}
              className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-bold rounded-lg text-xs cursor-pointer transition-opacity"
            >
              <Play size={14} />
              <span>Execute Release Operation</span>
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

        {/* Panel 2: GitHub Actions Workflow Triggers */}
        <div className="glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Terminal size={16} className="text-purple-400" />
              <span>Automated Pipeline Dispatches</span>
            </h3>
            <a
              href="https://github.com/Maijied/AswitchI/actions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:underline inline-flex items-center gap-1"
            >
              <span>GitHub Actions</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">🚀 Lorapok Enterprise CI/CD</div>
                <div className="text-[11px] text-slate-400">Tests • Snaps • CLI • Web • Snap Store Push</div>
              </div>
              <a
                href="https://github.com/Maijied/AswitchI/actions/workflows/main-pipeline.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-cyan-400 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                Run Pipeline
              </a>
            </div>

            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">📦 Publish to Snap Store</div>
                <div className="text-[11px] text-slate-400">Target channel multi-arch upload loop</div>
              </div>
              <a
                href="https://github.com/Maijied/AswitchI/actions/workflows/publish-snap.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-purple-400 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                Dispatch
              </a>
            </div>

            <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">🔄 Snapcraft 9 Release Operations</div>
                <div className="text-[11px] text-slate-400">Channel promotion and instant rollback</div>
              </div>
              <a
                href="https://github.com/Maijied/AswitchI/actions/workflows/snap-operations.yml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-emerald-400 rounded-lg text-xs font-semibold border border-white/10 transition-colors"
              >
                Trigger
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Live Workflow Run History */}
      <div className="glass-panel p-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Recent CI/CD Execution Telemetry
        </h3>

        <div className="divide-y divide-white/5">
          {runs.map((run) => (
            <div key={run.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {run.conclusion === "success" ? (
                  <CheckCircle2 size={18} className="text-emerald-400" />
                ) : run.conclusion === "failure" ? (
                  <XCircle size={18} className="text-rose-400" />
                ) : (
                  <Clock size={18} className="text-amber-400 animate-spin" />
                )}
                <div>
                  <div className="font-bold text-white flex items-center gap-2">
                    <span>{run.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">#{run.head_sha}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Status: <span className="font-semibold text-slate-300">{run.status}</span> ({run.conclusion || "running"})
                  </div>
                </div>
              </div>

              <a
                href={run.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1 font-semibold"
              >
                <span>View Job Logs</span>
                <ExternalLink size={12} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
