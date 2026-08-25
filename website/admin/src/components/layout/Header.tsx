import React from "react";
import { auth } from "../../lib/firebase";
import { LogOut, ShieldCheck, ArrowLeft } from "lucide-react";

interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="glass-panel rounded-none rounded-b-2xl border-t-0 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <a href="../" className="flex items-center gap-2.5 text-decoration-none group">
          <img src="../assets/icon_animated.svg" alt="AswitchI Logo" className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <span className="font-bold text-white text-base tracking-tight">AswitchI</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            Mission Control
          </span>
        </a>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img
            src={user?.photoURL || "../assets/icon.png"}
            alt="Admin Profile"
            className="w-7 h-7 rounded-full border border-cyan-400/50 object-cover"
          />
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-white leading-none mb-0.5">
              {user?.displayName || "Master Admin"}
            </div>
            <div className="text-[10px] text-slate-400 leading-none font-mono">
              {user?.email || "mdshuvo40@gmail.com"}
            </div>
          </div>
        </div>

        <div className="h-4 w-px bg-white/10" />

        <button
          type="button"
          onClick={() => auth.signOut()}
          title="Sign Out"
          className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
