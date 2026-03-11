import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Camera, Fish, Utensils, LogOut, Edit3, Check } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";

interface ProfileModalProps {
  user: any;
  tanks: any[];
  livestock: any[];
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal = ({ user, tanks, livestock, onClose, onLogout }: ProfileModalProps) => {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || "");
  const [saving, setSaving] = useState(false);

  const saveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(auth.currentUser!, { displayName: newName.trim() });
      toast.success("Name updated!");
      setEditingName(false);
    } catch { toast.error("Failed to update name"); }
    finally { setSaving(false); }
  };

  const initial = (user?.displayName?.[0] || user?.email?.[0] || "A").toUpperCase();
  const totalLivestock = livestock.reduce((a: number, l: any) => a + (l.count || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="w-full max-w-md rounded-2xl border border-border/50 bg-[hsl(var(--card))] shadow-2xl overflow-hidden"
      >
        {/* Header gradient banner */}
        <div className="h-24 bg-gradient-to-br from-primary/30 via-primary/20 to-accent/20 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center text-white hover:bg-black/50 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Avatar */}
        <div className="px-6 pb-6 -mt-10">
          <div className="relative w-20 h-20 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-primary/20 border-4 border-[hsl(var(--card))] flex items-center justify-center text-primary font-display font-bold text-3xl shadow-lg">
              {initial}
            </div>
          </div>

          {/* Name */}
          <div className="mb-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && saveName()}
                  className="flex-1 px-3 py-1.5 rounded-xl bg-secondary/40 border border-primary/40 text-base font-bold text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
                <button onClick={saveName} disabled={saving}
                  className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                  <Check size={14} />
                </button>
                <button onClick={() => setEditingName(false)} className="w-8 h-8 rounded-xl bg-secondary/50 flex items-center justify-center text-muted-foreground">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl font-bold">{user?.displayName || "Aquarist"}</h2>
                <button onClick={() => setEditingName(true)} className="text-muted-foreground hover:text-primary transition-colors">
                  <Edit3 size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
            <Mail size={13} />
            <span>{user?.email}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Tanks", value: tanks.length, icon: Fish, color: "text-primary" },
              { label: "Livestock", value: totalLivestock, icon: Fish, color: "text-accent" },
              { label: "Member", value: "Free", icon: User, color: "text-muted-foreground" },
            ].map(s => (
              <div key={s.label} className="rounded-xl bg-secondary/30 border border-border/30 p-3 text-center">
                <s.icon size={14} className={`${s.color} mx-auto mb-1`} />
                <p className="font-display font-bold text-lg">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Account info */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/20">
              <span className="text-sm text-muted-foreground">Account type</span>
              <span className="text-sm font-semibold text-accent">Free Plan</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/20">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-xs font-mono text-muted-foreground truncate max-w-[140px]">{user?.uid?.slice(0,16)}…</span>
            </div>
          </div>

          {/* Logout */}
          <button onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400 text-sm font-semibold hover:bg-red-400/20 transition-all">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </motion.div>
    </div>
  );
};
