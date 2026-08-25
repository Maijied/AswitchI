import React from "react";
import { Search, CheckCircle2, Shield, Share2, Globe } from "lucide-react";

export default function SeoDashboard() {
  const audits = [
    { title: "Google Site Verification", status: "Verified", meta: "K5UPSSKq8a6bvP6hoEbP4-fGwUhDD5yZ7bnlKGtzH3Q", ok: true },
    { title: "Sitemap & Robots Protocol", status: "Active", meta: "https://aswitchi.lorapok.tech/sitemap.xml", ok: true },
    { title: "OpenGraph / Twitter Banners", status: "Active", meta: "1280x640 High-Res Social Preview configured", ok: true },
    { title: "Canonical Domain Alignment", status: "Enforced", meta: "https://aswitchi.lorapok.tech/", ok: true },
    { title: "Google Analytics 4 Tracking", status: "Active", meta: "G-ASWITCHI2026 with IP anonymization", ok: true },
    { title: "Structured Data (JSON-LD)", status: "Validated", meta: "Schema.org/SoftwareApplication for Canonical Snap", ok: true }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">SEO & Marketing Intelligence</h2>
        <p className="text-xs text-slate-400">Google Search Console verification, schema validation, and GA4 telemetry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {audits.map((item, idx) => (
          <div key={idx} className="glass-panel p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">{item.title}</span>
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={13} />
                <span>{item.status}</span>
              </span>
            </div>
            <div className="text-xs font-mono text-cyan-400/90 break-all bg-black/40 p-2.5 rounded-lg border border-white/5">
              {item.meta}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
