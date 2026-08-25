import React, { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import Header from "./layout/Header";
import Overview from "./pages/Overview";
import Deployments from "./pages/Deployments";
import Ecosystem from "./pages/Ecosystem";
import SeoDashboard from "./pages/SeoDashboard";
import Logs from "./pages/Logs";
import { LayoutDashboard, Rocket, Layers, Search, Terminal } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "deployments" | "ecosystem" | "seo" | "logs">("overview");
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(setCurrentUser);
    return unsub;
  }, []);

  const tabs = [
    { id: "overview", label: "Overview & HUD", icon: LayoutDashboard },
    { id: "deployments", label: "Deployments & Release", icon: Rocket },
    { id: "ecosystem", label: "AI Ecosystem", icon: Layers },
    { id: "seo", label: "SEO & Traffic", icon: Search },
    { id: "logs", label: "Security Logs", icon: Terminal },
  ];

  return (
    <div className="min-h-screen bg-[#050814] flex flex-col relative pb-12">
      {/* Top ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Topbar */}
      <Header user={currentUser} />

      {/* Navigation Bar */}
      <div className="px-6 pt-4 border-b border-white/10 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "border-cyan-400 text-cyan-400 bg-cyan-500/5"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:border-white/20"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Pane */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10">
        {activeTab === "overview" && <Overview />}
        {activeTab === "deployments" && <Deployments />}
        {activeTab === "ecosystem" && <Ecosystem />}
        {activeTab === "seo" && <SeoDashboard />}
        {activeTab === "logs" && <Logs />}
      </main>
    </div>
  );
}
