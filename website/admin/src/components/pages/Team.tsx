import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, Users, Plus, Trash2, CheckCircle2, UserCog } from "lucide-react";
import { getAllUsersAccess, setUserAccess, removeUserAccess, type UserAccess, type Role, MASTER_ADMIN } from "../../lib/rbac";
import { useAuth } from "../../lib/auth-guard";

export default function Team() {
  const { access } = useAuth();
  const [users, setUsers] = useState<UserAccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<Role>("dev");
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getAllUsersAccess();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (access?.permissions.canManageUsers) {
      loadUsers();
    } else {
      setLoading(false);
    }
  }, [access]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes("@")) return setMessage({ type: "error", text: "Invalid email address." });
    
    try {
      await setUserAccess(newEmail, newRole);
      setMessage({ type: "success", text: `Successfully added ${newEmail} as ${newRole.toUpperCase()}.` });
      setNewEmail("");
      loadUsers();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleRemoveUser = async (email: string) => {
    if (!window.confirm(`Are you sure you want to revoke access for ${email}?`)) return;
    try {
      await removeUserAccess(email);
      setMessage({ type: "success", text: `Access revoked for ${email}.` });
      loadUsers();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (!access?.permissions.canManageUsers) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <ShieldAlert size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Insufficient Clearance</h2>
        <p className="text-slate-400 max-w-md">Your current role ({access?.role.toUpperCase()}) does not have permission to manage team members or access control lists.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Access Control & Team</h1>
          <p className="text-slate-400 text-sm">Manage roles, permissions, and dashboard access.</p>
        </div>
        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center gap-3">
          <Shield className="text-purple-400" size={24} />
          <div>
            <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Your Role</div>
            <div className="text-sm text-white font-medium capitalize">{access.role}</div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl text-sm flex items-center gap-2 border ${
          message.type === "success" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"
        }`}>
          {message.type === "success" ? <CheckCircle2 size={16} /> : <ShieldAlert size={16} />}
          {message.text}
        </div>
      )}

      {/* Add New User */}
      <div className="glass-panel p-6 border-cyan-500/30">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <UserCog size={16} className="text-cyan-400" />
          Assign New Role
        </h3>
        <form onSubmit={handleAddUser} className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">User Email</label>
            <input 
              type="email" 
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none" 
              placeholder="developer@example.com"
              required
            />
          </div>
          <div className="w-48">
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Role Level</label>
            <select 
              value={newRole}
              onChange={e => setNewRole(e.target.value as Role)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-cyan-400 focus:outline-none capitalize"
            >
              <option value="admin">Admin (Deployment Access)</option>
              <option value="moderator">Moderator (Content & SEO)</option>
              <option value="dev">Developer (Logs & Audit)</option>
            </select>
          </div>
          <button 
            type="submit"
            className="h-[38px] px-5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Assign
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users size={16} className="text-slate-400" />
            Active Team Members
          </h3>
          <div className="text-xs text-slate-500 font-mono">{users.length} Total</div>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading access control list...</div>
        ) : (
          <div className="divide-y divide-white/5">
            {users.map(u => (
              <div key={u.email} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div>
                  <div className="font-medium text-white flex items-center gap-2">
                    {u.email}
                    {u.role === "master" && <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider border border-purple-500/30">Master</span>}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 capitalize flex gap-3">
                    <span>Role: {u.role}</span>
                    <span className="text-slate-600">•</span>
                    <span>Added: {new Date(u.addedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    {u.permissions.canDeploy && <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20">Deploy</span>}
                    {u.permissions.canManageUsers && <span className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 text-[10px] border border-rose-500/20">Users</span>}
                    {u.permissions.canViewLogs && <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">Logs</span>}
                  </div>
                  
                  {u.email !== MASTER_ADMIN && access.permissions.canManageUsers && (
                    <button
                      onClick={() => handleRemoveUser(u.email)}
                      className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Revoke Access"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
