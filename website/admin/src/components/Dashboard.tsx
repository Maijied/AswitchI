import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../lib/firebase";
import Header from "./layout/Header";
import Overview from "./pages/Overview";
import Deployments from "./pages/Deployments";
import Ecosystem from "./pages/Ecosystem";
import SeoDashboard from "./pages/SeoDashboard";
import Logs from "./pages/Logs";
import Team from "./pages/Team";
import { LayoutDashboard, Rocket, Layers, Search, Terminal, Users } from "lucide-react";
import { useAuth } from "../lib/auth-guard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "deployments" | "ecosystem" | "seo" | "logs" | "team">("overview");
  const { user: currentUser, access } = useAuth();

  const tabs = [
    { id: "overview", label: "Overview & HUD", icon: LayoutDashboard, show: true },
    { id: "deployments", label: "Deployments & Release", icon: Rocket, show: access?.permissions?.canDeploy },
    { id: "ecosystem", label: "AI Ecosystem", icon: Layers, show: true },
    { id: "seo", label: "SEO & Traffic", icon: Search, show: access?.permissions?.canEditContent },
    { id: "logs", label: "Security Logs", icon: Terminal, show: access?.permissions?.canViewLogs },
    { id: "team", label: "Access & Team", icon: Users, show: access?.permissions?.canManageUsers },
  ].filter(tab => tab.show);

  return (
    <div className="min-h-screen bg-[#04060d] flex flex-col relative pb-12">
      {/* Top ambient lights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Topbar */}
      <Header user={currentUser} />

      {/* Navigation Bar with Animated Indicator */}
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
                className={`relative flex items-center gap-2 px-4 py-3 text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? "text-cyan-400"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 shadow-[0_0_8px_rgba(0,242,254,0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Pane with Framer Motion Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {activeTab === "overview" && <Overview />}
            {activeTab === "deployments" && <Deployments />}
            {activeTab === "ecosystem" && <Ecosystem />}
            {activeTab === "seo" && <SeoDashboard />}
            {activeTab === "logs" && <Logs />}
            {activeTab === "team" && <Team />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
