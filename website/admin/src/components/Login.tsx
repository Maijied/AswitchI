import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../lib/firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, ArrowLeft, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: "error" | "success"; message: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if returning from a Google Redirect sign-in
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Redirect login error:", err);
        setAlert({ type: "error", message: err.message || "Redirect authentication failed." });
      });

    // Check if returning from a Magic Email Link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = localStorage.getItem("emailForSignIn");
      if (!emailForSignIn) {
        emailForSignIn = window.prompt("Please provide your confirmation email to complete sign-in:");
      }
      if (emailForSignIn) {
        setLoading(true);
        signInWithEmailLink(auth, emailForSignIn, window.location.href)
          .then(() => {
            localStorage.removeItem("emailForSignIn");
            navigate("/dashboard");
          })
          .catch((err) => {
            console.error("Email link sign-in error:", err);
            setAlert({ type: "error", message: err.message || "Failed to complete email link sign-in." });
          })
          .finally(() => setLoading(false));
      }
    }
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setAlert(null);
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/dashboard");
    } catch (err: any) {
      console.warn("Popup sign-in issue, attempting redirect fallback:", err);
      if (err.code === "auth/popup-blocked" || err.code === "auth/popup-closed-by-user") {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr: any) {
          setAlert({ type: "error", message: redirectErr.message || "Google authentication failed." });
        }
      } else {
        setAlert({ type: "error", message: err.message || "Google authentication failed." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setAlert(null);
    setLoading(true);

    try {
      const actionCodeSettings = {
        url: window.location.origin + window.location.pathname + window.location.hash,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      localStorage.setItem("emailForSignIn", email);
      setAlert({ type: "success", message: `Magic sign-in link dispatched to ${email}. Check your inbox.` });
    } catch (err: any) {
      console.error("Magic link error:", err);
      setAlert({ type: "error", message: err.message || "Failed to send magic link." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050814] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-panel max-w-md w-full p-8 relative z-10">
        <div className="text-center mb-8">
          <a href="../" className="inline-flex items-center gap-2 mb-4 group text-decoration-none">
            <img src="../assets/icon_animated.svg" alt="AswitchI Logo" className="w-10 h-10 group-hover:scale-105 transition-transform" />
            <div className="text-left">
              <div className="text-lg font-bold text-white tracking-tight">AswitchI</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400">Mission Control</div>
            </div>
          </a>
          <h1 className="text-2xl font-bold text-white mb-1.5">Admin Authentication</h1>
          <p className="text-xs text-slate-400">
            Clearance restricted to Lorapok Labs Master Admin (<strong>mdshuvo40@gmail.com</strong>).
          </p>
        </div>

        {alert && (
          <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 mb-6 ${
            alert.type === "error" ? "bg-rose-500/10 border border-rose-500/30 text-rose-300" : "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
          }`}>
            {alert.type === "error" ? <AlertCircle size={16} className="shrink-0" /> : <CheckCircle2 size={16} className="shrink-0" />}
            <span>{alert.message}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-white/10 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin text-slate-700" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            )}
            <span>{loading ? "Authenticating..." : "Sign in with Google Account"}</span>
          </button>

          <div className="flex items-center my-4 text-[11px] text-slate-500 uppercase tracking-wider">
            <div className="flex-1 border-b border-white/10" />
            <span className="px-3">or magic link</span>
            <div className="flex-1 border-b border-white/10" />
          </div>

          <form onSubmit={handleEmailMagicLink} className="space-y-2">
            <label htmlFor="email" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Administrator Email
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mdshuvo40@gmail.com"
                required
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-90 text-white px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-opacity flex items-center gap-1.5"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                <span>Send Link</span>
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <a href="../" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors">
            <ArrowLeft size={14} />
            <span>Return to Public Website</span>
          </a>
        </div>
      </div>
    </div>
  );
}
