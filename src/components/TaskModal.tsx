import { useState } from "react";
import { motion } from "framer-motion";
import { X, Calendar, Bell, Plus, Check } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";

interface TaskModalProps {
  tankId: string;
  onClose: () => void;
}

export const TaskModal = ({ tankId, onClose }: TaskModalProps) => {
  const [form, setForm] = useState({ title: "", date: "", priority: "Medium" });
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;
    setSaving(true);
    try {
      // Optimistic close
      toast.success("Reminder set!");
      onClose();
      await addDoc(collection(db, "tanks", tankId, "tasks"), {
        ...form,
        completed: false,
        createdAt: serverTimestamp(),
      });
    } catch {
      toast.error("Failed to set reminder");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm glass-card p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={18} />
        </button>
        <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
          <Bell size={18} className="text-primary" /> Set Reminder
        </h2>
        <form onSubmit={save} className="space-y-4">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Task Description</label>
            <input 
              autoFocus
              placeholder="e.g. Water Change, Filter Cleaning"
              value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-sm focus:outline-none focus:border-primary/60 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Due Date</label>
              <input 
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-xs focus:outline-none focus:border-primary/60 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground uppercase mb-1 block">Priority</label>
              <select 
                value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-xs focus:outline-none focus:border-primary/60 transition-all"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving || !form.title} 
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow)] disabled:opacity-50">
              {saving ? "Saving..." : "Set Task"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
