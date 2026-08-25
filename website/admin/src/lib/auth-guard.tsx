import React, { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { isMasterAdmin } from "./admin-config";
import { ShieldAlert, LogOut } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session has active emergency vault authentication
    const vaultAuthEmail = sessionStorage.getItem("aswitchi_vault_auth");
    if (vaultAuthEmail && isMasterAdmin(vaultAuthEmail)) {
      setUser({
        email: vaultAuthEmail,
        displayName: "Master Admin (Vault Cleared)",
        photoURL: null,
        uid: "vault-master-admin",
        emailVerified: true
      } as any);
      setIsAuthorized(true);
      setLoading(false);
      return;
    }

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u?.email) {
        setIsAuthorized(isMasterAdmin(u.email));
      } else {
        setIsAuthorized(false);
      }
      setLoading(false);
    });

    return unsub;
  }, []);

  const handleSignOut = async () => {
    sessionStorage.removeItem("aswitchi_vault_auth");
    await auth.signOut();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#04060d] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-3 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-sm font-medium text-slate-400">Verifying Mission Control clearance…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#04060d] flex items-center justify-center p-6">
        <div className="glass-panel max-w-md w-full p-8 text-center border-rose-500/30">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-rose-400 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your Account (<strong>{user.email}</strong>) is not registered in the Master Admin clearance roster.
          </p>
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-rose-300/80 mb-6 font-mono">
            Required Clearance: mdshuvo40@gmail.com
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10"
          >
            <LogOut size={16} />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
