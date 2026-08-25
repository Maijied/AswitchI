import React, { useEffect, useState, type ReactNode, createContext, useContext } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { getUserAccess, UserAccess, MASTER_ADMIN } from "./rbac";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

interface AuthContextType {
  user: User | null;
  access: UserAccess | null;
}

const AuthContext = createContext<AuthContextType>({ user: null, access: null });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [access, setAccess] = useState<UserAccess | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if session has active emergency vault authentication
    const vaultAuthEmail = sessionStorage.getItem("aswitchi_vault_auth");
    if (vaultAuthEmail === MASTER_ADMIN) {
      setUser({
        email: vaultAuthEmail,
        displayName: "Master Admin (Vault Cleared)",
        photoURL: null,
        uid: "vault-master-admin",
        emailVerified: true
      } as any);
      getUserAccess(vaultAuthEmail).then(a => {
        setAccess(a);
        setLoading(false);
      });
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u?.email) {
        const userAccess = await getUserAccess(u.email);
        setAccess(userAccess);
      } else {
        setAccess(null);
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
        <Loader2 size={32} className="text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Verifying Mission Control clearance…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!access) {
    return (
      <div className="min-h-screen bg-[#04060d] flex items-center justify-center p-6">
        <div className="glass-panel max-w-md w-full p-8 text-center border-rose-500/30">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold text-rose-400 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-400 mb-6">
            Your Account (<strong>{user.email}</strong>) does not have any assigned roles in the system.
          </p>
          <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-xl text-xs text-rose-300/80 mb-6">
            Please ask the Master Admin to assign you a role (Admin, Moderator, or Dev).
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10 cursor-pointer"
          >
            <LogOut size={16} />
            <span>Sign Out & Switch Account</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, access }}>
      {children}
    </AuthContext.Provider>
  );
}
