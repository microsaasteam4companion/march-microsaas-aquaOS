import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Droplets, Fish, FlaskConical, BarChart3, Plus, TrendingUp, AlertTriangle, 
  LogOut, Trash2, Edit3, X, Thermometer, Waves, Search, Utensils, ChevronDown, 
  Bell, Calendar, CheckSquare, Square, Clock, Check, Sun, Moon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import logo from "@/assets/aquaos-logo-new.png";
import { FishChatbot } from "@/components/FishChatbot";
import { ProfileModal } from "@/components/ProfileModal";
import { SPECIES_DB } from "@/data/speciesDB";
import { TaskModal } from "@/components/TaskModal";

/* ─── Safe ranges ───────────────────────────────────────────────── */
const SAFE: Record<string, {min:number; max:number}> = {
  ph:{min:6.8,max:8.5}, ammonia:{min:0,max:0.25}, nitrite:{min:0,max:0.5},
  nitrate:{min:0,max:40}, temp:{min:72,max:82}, salinity:{min:0,max:1.035},
};
const paramStatus = (key:string,val:number) => {
  const r=SAFE[key]; if(!r) return "ok";
  if(val<r.min||val>r.max) return "danger";
  if(key==="ammonia"&&val>0.1) return "warning";
  if(key==="nitrate"&&val>25) return "warning";
  return "ok";
};
const sColor:Record<string,string> = { ok:"text-accent", warning:"text-yellow-400", danger:"text-red-400" };
const sBg:Record<string,string>    = { ok:"bg-accent/10 border-accent/20", warning:"bg-yellow-400/10 border-yellow-400/20", danger:"bg-red-400/10 border-red-400/20" };

/* ─── Mini Input ────────────────────────────────────────────────── */
const Inp = ({label,name,form,setForm,type="text",step}:{label:string;name:string;form:any;setForm:any;type?:string;step?:string}) => (
  <div>
    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{label}</label>
    <input type={type} step={step} value={form[name]}
      onChange={e=>setForm((p:any)=>({...p,[name]:type==="number"?Number(e.target.value):e.target.value}))}
      className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all" />
  </div>
);

/* ─── Modal Shell ───────────────────────────────────────────────── */
const Modal = ({children,onClose}:{children:React.ReactNode;onClose:()=>void}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
    <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
      className="w-full max-w-lg glass-card p-6 relative my-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18}/></button>
      {children}
    </motion.div>
  </div>
);

/* ─── Add Tank Modal ────────────────────────────────────────────── */
const AddTankModal = ({userId,onClose}:{userId:string;onClose:()=>void}) => {
  const [form,setForm]=useState({name:"",size:"20 Gallon",type:"Freshwater",ph:7.0,ammonia:0,nitrite:0,nitrate:5,temp:76,salinity:1.0});
  const [saving,setSaving]=useState(false);
  const save=async(e:React.FormEvent)=>{
    e.preventDefault();setSaving(true);
    try{await addDoc(collection(db,"tanks"),{...form,userId,createdAt:serverTimestamp()});toast.success("Tank added! 🐠");onClose();}
    catch{toast.error("Failed to save tank");}finally{setSaving(false);}
  };
  return <Modal onClose={onClose}><h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Plus size={18} className="text-primary"/> Add New Tank</h2>
    <form onSubmit={save} className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><Inp label="Tank Name" name="name" form={form} setForm={setForm}/><Inp label="Size" name="size" form={form} setForm={setForm}/></div>
      <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Water Type</label>
        <select value={form.type} onChange={e=>setForm((p:any)=>({...p,type:e.target.value}))} className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all">
          <option className="bg-background text-foreground">Freshwater</option>
          <option className="bg-background text-foreground">Saltwater</option>
          <option className="bg-background text-foreground">Brackish</option>
        </select></div>
      <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider pt-1">Initial Parameters</p>
      <div className="grid grid-cols-3 gap-3">
        <Inp label="pH" name="ph" form={form} setForm={setForm} type="number" step="0.1"/>
        <Inp label="Ammonia ppm" name="ammonia" form={form} setForm={setForm} type="number" step="0.01"/>
        <Inp label="Nitrite ppm" name="nitrite" form={form} setForm={setForm} type="number" step="0.01"/>
        <Inp label="Nitrate ppm" name="nitrate" form={form} setForm={setForm} type="number" step="0.1"/>
        <Inp label="Temp °F" name="temp" form={form} setForm={setForm} type="number" step="0.1"/>
        <Inp label="Salinity" name="salinity" form={form} setForm={setForm} type="number" step="0.001"/>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow)] hover:opacity-90 transition-all disabled:opacity-50">{saving?"Saving…":"Add Tank"}</button>
      </div>
    </form></Modal>;
};

/* ─── Edit Params Modal ─────────────────────────────────────────── */
const EditParamsModal = ({tank,onClose}:{tank:any;onClose:()=>void}) => {
  const [form,setForm]=useState({name:tank.name,size:tank.size,ph:tank.ph,ammonia:tank.ammonia,nitrite:tank.nitrite,nitrate:tank.nitrate,temp:tank.temp,salinity:tank.salinity});
  const [saving,setSaving]=useState(false);
  const save=async(e:React.FormEvent)=>{
    e.preventDefault();setSaving(true);
    try{
      await updateDoc(doc(db,"tanks",tank.id),{...form});
      // Log to history
      await addDoc(collection(db,"tanks",tank.id,"history"),{...form,loggedAt:serverTimestamp()});
      toast.success("Parameters updated & logged!");onClose();
    }catch{toast.error("Update failed");}finally{setSaving(false);}
  };
  return <Modal onClose={onClose}><h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Edit3 size={18} className="text-primary"/> Update Parameters</h2>
    <form onSubmit={save} className="space-y-3">
      <div className="grid grid-cols-2 gap-3"><Inp label="Name" name="name" form={form} setForm={setForm}/><Inp label="Size" name="size" form={form} setForm={setForm}/></div>
      <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Water Parameters</p>
      <div className="grid grid-cols-3 gap-3">
        {(["ph","ammonia","nitrite","nitrate","temp","salinity"] as const).map(k=>{
          const s=paramStatus(k,form[k]);
          return <div key={k}>
            <label className={`text-[11px] font-semibold uppercase tracking-wider mb-1 block ${sColor[s]}`}>{k}</label>
            <input type="number" step="0.01" value={form[k]} onChange={e=>setForm((p:any)=>({...p,[k]:Number(e.target.value)}))}
              className={`w-full px-3 py-2 rounded-xl bg-secondary/40 border text-sm text-foreground focus:outline-none transition-all ${s==="danger"?"border-red-400/60":s==="warning"?"border-yellow-400/60":"border-border/40 focus:border-primary/60"}`}/>
          </div>;
        })}
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow)] hover:opacity-90 transition-all disabled:opacity-50">{saving?"Saving…":"Save & Log"}</button>
      </div>
    </form></Modal>;
};

/* ─── Add Livestock Modal ───────────────────────────────────────── */
const AddLivestockModal = ({tankId,onClose}:{tankId:string;onClose:()=>void}) => {
  const [form,setForm]=useState({name:"",count:1,type:"Fish",status:"healthy"});
  const [saving,setSaving]=useState(false);
  const save=async(e:React.FormEvent)=>{
    e.preventDefault();setSaving(true);
    try{await addDoc(collection(db,"tanks",tankId,"livestock"),{...form,addedAt:serverTimestamp()});toast.success("Added! 🐟");onClose();}
    catch{toast.error("Failed");}finally{setSaving(false);}
  };
  return <Modal onClose={onClose}><h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Fish size={18} className="text-primary"/> Add Livestock</h2>
    <form onSubmit={save} className="space-y-3">
      <Inp label="Species Name" name="name" form={form} setForm={setForm}/>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Count</label>
          <input type="number" min={1} value={form.count} onChange={e=>setForm(p=>({...p,count:Number(e.target.value)}))} className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all"/></div>
        <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Type</label>
          <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all">
            <option className="bg-background text-foreground">Fish</option>
            <option className="bg-background text-foreground">Coral</option>
            <option className="bg-background text-foreground">Invertebrate</option>
            <option className="bg-background text-foreground">Plant</option>
          </select></div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow)] disabled:opacity-50">{saving?"Adding…":"Add"}</button>
      </div>
    </form></Modal>;
};

/* ─── Log Feeding Modal ─────────────────────────────────────────── */
const LogFeedingModal = ({tankId,onClose}:{tankId:string;onClose:()=>void}) => {
  const [form,setForm]=useState({food:"",amount:"",notes:""});
  const [saving,setSaving]=useState(false);
  const save=async(e:React.FormEvent)=>{
    e.preventDefault();setSaving(true);
    try{await addDoc(collection(db,"tanks",tankId,"feeding"),{...form,loggedAt:serverTimestamp()});toast.success("Feeding logged! 🦐");onClose();}
    catch{toast.error("Failed");}finally{setSaving(false);}
  };
  return <Modal onClose={onClose}><h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2"><Utensils size={18} className="text-primary"/> Log Feeding</h2>
    <form onSubmit={save} className="space-y-3">
      <Inp label="Food Type (e.g. Flakes, Pellets, Brine Shrimp)" name="food" form={form} setForm={setForm}/>
      <Inp label="Amount (e.g. Pinch, 5 pellets)" name="amount" form={form} setForm={setForm}/>
      <div><label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Notes (refused food, sick fish etc.)</label>
        <textarea value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} rows={3}
          className="w-full px-3 py-2 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all resize-none"/></div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-secondary/50 border border-border/40 text-sm font-semibold text-muted-foreground hover:text-foreground transition-all">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow)] disabled:opacity-50">{saving?"Logging…":"Log Feeding"}</button>
      </div>
    </form></Modal>;
};

/* ─── DASHBOARD ─────────────────────────────────────────────────── */
const TABS = ["Overview","Water Log","Livestock","Tasks","Species","Compatibility","Feeding"] as const;
type Tab = typeof TABS[number];

const Dashboard = () => {
  const navigate = useNavigate();
  const [user,setUser]=useState<any>(null);
  const [authLoading,setAuthLoading]=useState(true);
  const [tanks,setTanks]=useState<any[]>([]);
  const [tanksLoading,setTanksLoading]=useState(true);
  const [selectedTank,setSelectedTank]=useState<any>(null);
  const [livestock,setLivestock]=useState<any[]>([]);
  const [history,setHistory]=useState<any[]>([]);
  const [tasks,setTasks]=useState<any[]>([]);
  const [feeding,setFeeding]=useState<any[]>([]);
  const [tab,setTab]=useState<Tab>("Overview");
  const [showAddTank,setShowAddTank]=useState(false);
  const [showEdit,setShowEdit]=useState(false);
  const [showAddLS,setShowAddLS]=useState(false);
  const [showLogFeed,setShowLogFeed]=useState(false);
  const [showAddTask,setShowAddTask]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [speciesSearch,setSpeciesSearch]=useState("");
  const [compatA,setCompatA]=useState("");
  const [compatB,setCompatB]=useState("");
  const [showAlerts,setShowAlerts]=useState(false);
  const [isDark,setIsDark]=useState(true);
  const prevTankIdRef=useRef<string|null>(null);

  // Theme Sync
  useEffect(() => {
    const saved = localStorage.getItem("aquaos-theme");
    if (saved === "light") {
      setIsDark(false);
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    if (next) {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("aquaos-theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("aquaos-theme", "light");
    }
  };

  // Auth
  useEffect(()=>{
    const unsub=onAuthStateChanged(auth,u=>{
      setAuthLoading(false);
      if(u) setUser(u);
      else navigate("/signup",{replace:true});
    });
    return ()=>unsub();
  },[navigate]);

  // Tanks — NO orderBy to avoid composite index requirement
  useEffect(()=>{
    if(!user) return;
    const q=query(collection(db,"tanks"),where("userId","==",user.uid));
    const unsub=onSnapshot(q,snap=>{
      const list=snap.docs.map(d=>({id:d.id,...d.data()}));
      setTanks(list);
      setTanksLoading(false);
      if(list.length>0&&(!selectedTank||!list.find((t:any)=>t.id===selectedTank.id))){
        setSelectedTank(list[0]);
      }
      if(list.length===0) setSelectedTank(null);
    },err=>{console.error(err);setTanksLoading(false);});
    return ()=>unsub();
  },[user]);

  // Sync selected tank with fresh Firestore data
  useEffect(()=>{
    if(!selectedTank||!tanks.length) return;
    const fresh=tanks.find((t:any)=>t.id===selectedTank.id);
    if(fresh) setSelectedTank(fresh);
  },[tanks]);

  // Livestock, History & Feeding
  useEffect(()=>{
    if(!selectedTank) {setLivestock([]);setHistory([]);setFeeding([]);return;}
    if(prevTankIdRef.current===selectedTank.id) return;
    prevTankIdRef.current=selectedTank.id;
    const u1=onSnapshot(collection(db,"tanks",selectedTank.id,"livestock"),s=>setLivestock(s.docs.map(d=>({id:d.id,...d.data()}))));
    const u2=onSnapshot(collection(db,"tanks",selectedTank.id,"history"),s=>{
      const sorted=s.docs.map(d=>({id:d.id,...d.data()})).sort((a:any,b:any)=>a.loggedAt?.seconds-b.loggedAt?.seconds);
      setHistory(sorted);
    });
    const u3=onSnapshot(collection(db,"tanks",selectedTank.id,"feeding"),s=>{
      const sorted=s.docs.map(d=>({id:d.id,...d.data()})).sort((a:any,b:any)=>b.loggedAt?.seconds-a.loggedAt?.seconds);
      setFeeding(sorted);
    });
    const u4=onSnapshot(collection(db,"tanks",selectedTank.id,"tasks"),s=>{
      setTasks(s.docs.map(d=>({id:d.id,...d.data()})));
    });
    return ()=>{u1();u2();u3();u4();};
  },[selectedTank?.id]);

  const handleSelectTank=(t:any)=>{prevTankIdRef.current=null;setSelectedTank(t);};
  const deleteTank=async(id:string)=>{if(!confirm("Delete tank?")) return; await deleteDoc(doc(db,"tanks",id));toast.success("Tank deleted");};
  const deleteLivestock=async(lsId:string)=>{if(!selectedTank) return; await deleteDoc(doc(db,"tanks",selectedTank.id,"livestock",lsId));};
  const deleteFeed=async(fId:string)=>{if(!selectedTank) return; await deleteDoc(doc(db,"tanks",selectedTank.id,"feeding",fId));};
  
  const toggleTask=async(tId:string,done:boolean)=>{
    if(!selectedTank) return;
    await updateDoc(doc(db,"tanks",selectedTank.id,"tasks",tId),{completed:!done});
  };
  const deleteTsk=async(tId:string)=>{
    if(!selectedTank||!confirm("Delete task?")) return;
    await deleteDoc(doc(db,"tanks",selectedTank.id,"tasks",tId));
  };
  const alerts = selectedTank ? (()=>{
    const a:any[]=[];const t=selectedTank;
    if(t.ammonia>0.25) a.push({s:"danger",msg:`🚨 Ammonia critical (${t.ammonia} ppm) - emergency water change NOW`});
    else if(t.ammonia>0.1) a.push({s:"warning",msg:`⚠️ Ammonia elevated (${t.ammonia} ppm) - monitor closely`});
    if(t.nitrite>0.5) a.push({s:"danger",msg:`🚨 Nitrite toxic (${t.nitrite} ppm) - immediate action!`});
    else if(t.nitrite>0) a.push({s:"warning",msg:`⚠️ Nitrite detectable (${t.nitrite} ppm) - tank may be cycling`});
    if(t.nitrate>40) a.push({s:"danger",msg:`🚨 Nitrate too high (${t.nitrate} ppm) - do water change`});
    else if(t.nitrate>25) a.push({s:"warning",msg:`⚠️ Nitrate rising (${t.nitrate} ppm) - schedule water change`});
    if(t.ph<6.8) a.push({s:"danger",msg:`🚨 pH too low (${t.ph}) - buffer immediately`});
    else if(t.ph>8.5) a.push({s:"danger",msg:`🚨 pH too high (${t.ph}) - check alkalinity`});
    if(t.temp<72) a.push({s:"warning",msg:`⚠️ Too cold (${t.temp}°F) - check heater`});
    else if(t.temp>82) a.push({s:"danger",msg:`🚨 Too hot (${t.temp}°F) - add cooling urgently`});
    if(a.length===0) a.push({s:"ok",msg:"✅ All parameters in safe range - tank looks great!"});
    return a;
  })():[];

  const hasAlert = alerts.some(a=>a.s==="danger"||a.s==="warning");

  // Push Notifications (Toast alerts for critical params)
  useEffect(()=>{
    if(!hasAlert) return;
    const critical = alerts.find(a=>a.s==="danger");
    if(critical) {
      toast.error(critical.msg, {
        duration: 8000,
        icon: '🚨',
        description: 'Critical action required for tank health.'
      });
    }
  },[alerts.length, selectedTank?.id]);

  const compatResult = (()=>{
    if(!compatA||!compatB) return null;
    const sA=SPECIES_DB.find(s=>s.name===compatA);
    const sB=SPECIES_DB.find(s=>s.name===compatB);
    if(!sA||!sB) return null;
    const issues:string[]=[];

    // Overview of species
    issues.push(`ℹ️ **Overview:** ${sA.name} is a ${sA.size} (${sA.care} level) species that prefers the ${sA.swimming} level of the tank. ${sB.name} is a ${sB.size} (${sB.care} level) species that mostly occupies the ${sB.swimming} level.`);

    // Aggression / Known Incompatibility
    if(sA.incompat.some((n:string)=>n===compatB)||sB.incompat.some((n:string)=>n===compatA)) {
      issues.push(`⚠️ **Not Compatible!** ${compatA} and ${compatB} have known behavioral or predatory issues. Keeping them together will cause extreme stress, injury, or death.`);
    }

    // Water Type
    if(sA.type!==sB.type) {
      issues.push(`❌ **Water Mismatch!** ${compatA} requires a ${sA.type} environment, while ${compatB} requires a ${sB.type} environment. They absolutely cannot survive in the same tank.`);
    }

    // pH
    const phOvMin=Math.max(sA.ph[0],sB.ph[0]);
    const phOvMax=Math.min(sA.ph[1],sB.ph[1]);
    if(phOvMin>phOvMax) {
      issues.push(`❌ **pH Mismatch!** ${compatA} needs a pH of ${sA.ph[0]}-${sA.ph[1]}, but ${compatB} needs a pH of ${sB.ph[0]}-${sB.ph[1]}. These ranges do not overlap, so one species will constantly suffer from incorrect water chemistry.`);
    } else {
      issues.push(`✅ **Good pH Match:** Both species can comfortably share a pH range of ${phOvMin.toFixed(1)} to ${phOvMax.toFixed(1)}.`);
    }

    // Temperature
    const tOvMin=Math.max(sA.temp[0],sB.temp[0]);
    const tOvMax=Math.min(sA.temp[1],sB.temp[1]);
    if(tOvMin>tOvMax) {
      issues.push(`❌ **Temperature Mismatch!** ${compatA} prefers ${sA.temp[0]}-${sA.temp[1]}°F, while ${compatB} prefers ${sB.temp[0]}-${sB.temp[1]}°F. To keep one happy, the other would have to freeze or overheat.`);
    } else {
      issues.push(`✅ **Good Temp Match:** Both thrive in water temperatures between ${tOvMin}°F and ${tOvMax}°F.`);
    }
    
    // Final Conclusion
    if(!issues.some(i => i.startsWith("❌") || i.startsWith("⚠️"))) {
      issues.unshift(`🌟 **Great Choice!** ${compatA} and ${compatB} should live happily and peacefully together in the same aquarium.`);
    } else {
      issues.unshift(`🚨 **Warning!** These species are generally not recommended to be kept together.`);
    }

    return {ok:issues.filter(i=>i.startsWith("✅")||i.startsWith("🌟")||i.startsWith("ℹ️")).length,issues};
  })();

  if(authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div animate={{rotate:360}} transition={{duration:1,repeat:Infinity,ease:"linear"}} className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full"/>
    </div>
  );

  const ct=selectedTank;
  const params=ct?[
    {label:"pH",      value:ct.ph,       unit:"",     icon:Droplets,    key:"ph"},
    {label:"Ammonia", value:ct.ammonia,  unit:" ppm", icon:FlaskConical,key:"ammonia"},
    {label:"Nitrite", value:ct.nitrite,  unit:" ppm", icon:FlaskConical,key:"nitrite"},
    {label:"Nitrate", value:ct.nitrate,  unit:" ppm", icon:BarChart3,   key:"nitrate"},
    {label:"Temp",    value:ct.temp,     unit:"°F",   icon:Thermometer, key:"temp"},
    {label:"Salinity",value:ct.salinity, unit:"",     icon:Waves,       key:"salinity"},
  ]:[];

  const filteredSpecies=SPECIES_DB.filter(s=>s.name.toLowerCase().includes(speciesSearch.toLowerCase()));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence>
        {showAddTank&&user&&<AddTankModal userId={user.uid} onClose={()=>setShowAddTank(false)}/>}
        {showEdit&&ct&&<EditParamsModal tank={ct} onClose={()=>setShowEdit(false)}/>}
        {showAddLS&&ct&&<AddLivestockModal tankId={ct.id} onClose={()=>setShowAddLS(false)}/>}
        {showLogFeed&&ct&&<LogFeedingModal tankId={ct.id} onClose={()=>setShowLogFeed(false)}/>}
        {showAddTask&&ct&&<TaskModal tankId={ct.id} onClose={()=>setShowAddTask(false)}/>}
        {showProfile&&user&&<ProfileModal user={user} tanks={tanks} livestock={livestock} onClose={()=>setShowProfile(false)} onLogout={()=>signOut(auth).then(()=>navigate("/"))}/>}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border/20 bg-background/70 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
          <button onClick={()=>navigate("/")} className="flex items-center gap-2 group">
            <img src={logo} alt="AquaOS" className="w-8 h-8 object-contain"/>
            <span className="font-display text-lg font-bold text-gradient-primary">AquaOS</span>
          </button>
          <div className="flex items-center gap-2">
            {/* Alerts button + dropdown */}
            <div className="relative">
              <button onClick={()=>setShowAlerts(o=>!o)}
                className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all relative">
                <AlertTriangle size={15}/>
                {hasAlert&&<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-400 animate-pulse"/>}
              </button>
              <AnimatePresence>
                {showAlerts&&(
                  <motion.div initial={{opacity:0,y:-8,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-8,scale:0.96}}
                    className="absolute -right-12 sm:right-0 top-11 w-[calc(100vw-2rem)] sm:w-80 z-50 space-y-2 rounded-2xl border border-border/60 bg-[hsl(var(--card))] shadow-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-display font-bold text-sm flex items-center gap-1.5"><AlertTriangle size={13} className="text-yellow-400"/>Smart Alerts</p>
                      <button onClick={()=>setShowAlerts(false)} className="text-muted-foreground hover:text-foreground"><X size={14}/></button>
                    </div>
                    {!ct?<p className="text-xs text-muted-foreground italic">Select a tank to see alerts</p>:
                      alerts.map((a,i)=>(
                        <div key={i} className={`p-2.5 rounded-xl border text-xs ${sBg[a.s]}`}>{a.msg}</div>
                      ))
                    }
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button onClick={()=>signOut(auth).then(()=>navigate("/"))} className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-all"><LogOut size={15}/></button>
            <button onClick={()=>setShowProfile(true)} className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-bold text-sm hover:bg-primary/30 transition-all">{user?.displayName?.[0]?.toUpperCase()||user?.email?.[0]?.toUpperCase()||"A"}</button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-16 container mx-auto px-4 max-w-6xl">
        {/* Welcome */}
        <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="mb-6 pt-4">
          <h1 className="font-display text-2xl font-bold">Welcome back, {user?.displayName||"Aquarist"} 👋</h1>
          <p className="text-muted-foreground text-sm">Manage your aquariums in one place.</p>
        </motion.div>

        {/* Tank Selector */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
          {tanksLoading&&<div className="text-xs text-muted-foreground">Loading tanks…</div>}
          {!tanksLoading&&tanks.length===0&&<div className="glass-card px-4 py-2.5 text-sm text-muted-foreground italic">No tanks yet - add your first!</div>}
          {tanks.map(tank=>(
            <div key={tank.id} className="flex items-center gap-1 shrink-0">
              <button onClick={()=>handleSelectTank(tank)}
                className={`glass-card px-4 py-2.5 flex items-center gap-2 min-w-[160px] transition-all ${ct?.id===tank.id?"border-primary ring-1 ring-primary/20":"hover:border-primary/40"}`}>
                <Fish size={14} className={ct?.id===tank.id?"text-primary":"text-muted-foreground"}/>
                <div className="text-left"><p className="font-semibold text-sm truncate max-w-[100px]">{tank.name}</p><p className="text-[11px] text-muted-foreground">{tank.size}·{tank.type}</p></div>
              </button>
              <button onClick={()=>deleteTank(tank.id)} className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={12}/></button>
            </div>
          ))}
          <button onClick={()=>setShowAddTank(true)} className="glass-card px-3 py-2.5 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shrink-0"><Plus size={14}/>Add Tank</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab===t?"bg-primary text-primary-foreground shadow-[var(--shadow-glow-sm)]":"text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ── TAB: OVERVIEW ─────────────────────────────────────── */}
        {tab==="Overview"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
            {ct?(
              <>
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-sm text-muted-foreground uppercase tracking-wider">Water Parameters</h2>
                  <button onClick={()=>setShowEdit(true)} className="flex items-center gap-1 text-xs text-primary hover:underline font-semibold"><Edit3 size={11}/>Update & Log</button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {params.map((p,i)=>{const s=paramStatus(p.key,p.value);return(
                    <motion.div key={p.label} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}
                      className={`glass-card p-4 text-center ${s==="danger"?"border-red-400/40":s==="warning"?"border-yellow-400/30":""}`}>
                      <p.icon size={14} className={`${sColor[s]} mx-auto mb-1`}/>
                      <p className={`font-display font-bold text-lg ${sColor[s]}`}>{p.value}{p.unit}</p>
                      <p className="text-xs text-muted-foreground">{p.label}</p>
                      {s!=="ok"&&<p className={`text-[10px] font-bold mt-0.5 ${sColor[s]}`}>{s.toUpperCase()}</p>}
                    </motion.div>);
                  })}
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-display font-bold text-sm mb-3 flex items-center gap-2"><AlertTriangle size={14} className="text-yellow-400"/>Smart Alerts</h3>
                  <div className="space-y-2">
                    {alerts.map((a,i)=>(
                      <div key={i} className={`flex items-start gap-2 p-3 rounded-xl border text-sm ${sBg[a.s]}`}>{a.msg}</div>
                    ))}
                  </div>
                </div>
              </>
            ):<div className="text-center py-20 text-muted-foreground">Add a tank to see your overview</div>}
          </motion.div>
        )}

        {/* ── TAB: WATER LOG ────────────────────────────────────── */}
        {tab==="Water Log"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold">Water Parameter History</h2>
              {ct&&<button onClick={()=>setShowEdit(true)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow-sm)]"><Plus size={13} className="inline mr-1"/>Log Reading</button>}
            </div>
            {!ct?<div className="text-center py-20 text-muted-foreground">Select a tank first</div>:
            history.length===0?<div className="glass-card p-10 text-center text-muted-foreground text-sm">No readings yet - click "Update & Log" on Overview tab to start tracking.</div>:(
              <div className="space-y-4">
                {(["ph","ammonia","nitrite","nitrate","temp"] as const).map(key=>{
                  const data=history.map((h:any,i:number)=>({i:i+1,v:h[key]??0,label:`#${i+1}`}));
                  const r=SAFE[key];
                  const lastVal=data[data.length-1]?.v;
                  const s=paramStatus(key,lastVal??0);
                  return(
                    <div key={key} className={`glass-card p-5 ${s==="danger"?"border-red-400/30":s==="warning"?"border-yellow-400/20":""}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-display font-bold text-sm capitalize">{key} Trend</h3>
                        {lastVal!=null&&<span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${s==="danger"?"bg-red-400/15 text-red-400":s==="warning"?"bg-yellow-400/15 text-yellow-400":"bg-accent/10 text-accent"}`}>Latest: {lastVal} {s.toUpperCase()}</span>}
                      </div>
                      <ResponsiveContainer width="100%" height={130}>
                        <LineChart data={data} margin={{top:4,right:16,left:-28,bottom:0}}>
                          <XAxis dataKey="label" tick={{fontSize:10,fill:"hsl(var(--muted-foreground))"}} stroke="transparent"/>
                          <YAxis tick={{fontSize:10,fill:"hsl(var(--muted-foreground))"}} stroke="transparent"/>
                          <Tooltip contentStyle={{background:"hsl(var(--card))",border:"1px solid hsl(var(--border))",borderRadius:12,fontSize:11}} labelFormatter={(l)=>`Reading ${l}`} formatter={(v:any)=>[v,key]}/>
                          {r&&<ReferenceLine y={r.min} stroke="#facc15" strokeDasharray="4 4" strokeOpacity={0.6}/>}
                          {r&&<ReferenceLine y={r.max} stroke="#f87171" strokeDasharray="4 4" strokeOpacity={0.6}/>}
                          <Line type="monotone" dataKey="v" stroke={s==="danger"?"#f87171":s==="warning"?"#facc15":"hsl(var(--primary))"} strokeWidth={2.5} dot={{r:3.5,fill:s==="danger"?"#f87171":s==="warning"?"#facc15":"hsl(var(--primary))"}} activeDot={{r:6}}/>
                        </LineChart>
                      </ResponsiveContainer>
                      {r&&<p className="text-[10px] text-muted-foreground mt-1">🟡 Safe min: {r.min} · 🔴 Safe max: {r.max}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB: LIVESTOCK ────────────────────────────────────── */}
        {tab==="Livestock"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold">Livestock - {ct?.name||"Select a tank"}</h2>
              {ct&&<button onClick={()=>setShowAddLS(true)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow-sm)]"><Plus size={13} className="inline mr-1"/>Add</button>}
            </div>
            {!ct?<div className="text-center py-20 text-muted-foreground">Select a tank first</div>:
            livestock.length===0?<div className="glass-card p-10 text-center text-muted-foreground text-sm">No livestock added yet</div>:(
              <div className="grid sm:grid-cols-2 gap-3">
                {livestock.map(ls=>(
                  <div key={ls.id} className="glass-card p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Fish size={16} className="text-primary"/></div>
                      <div><p className="font-semibold text-sm">{ls.name}</p><p className="text-xs text-muted-foreground">{ls.type} · ×{ls.count}</p></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase">{ls.status}</span>
                      <button onClick={()=>deleteLivestock(ls.id)} className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={12}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {livestock.length>0&&<div className="text-right text-xs text-muted-foreground">Total: {livestock.reduce((a,l)=>a+l.count,0)} animals</div>}
          </motion.div>
        )}

        {/* ── TAB: TASKS ────────────────────────────────────────── */}
        {tab==="Tasks"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold">Reminders & Tasks</h2>
              {ct&&<button onClick={()=>setShowAddTask(true)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow-sm)]"><Plus size={13} className="inline mr-1"/>New Task</button>}
            </div>
            {!ct?<div className="text-center py-20 text-muted-foreground">Select a tank first</div>:
            tasks.length===0?<div className="glass-card p-10 text-center text-muted-foreground text-sm">No tasks yet - set your first reminder for water changes or feeding.</div>:(
              <div className="grid gap-2">
                {tasks.sort((a,b)=>Number(a.completed)-Number(b.completed)).map(t=>(
                  <div key={t.id} className={`glass-card p-4 flex items-center justify-between group transition-all ${t.completed?"opacity-60 grayscale":""}`}>
                    <div className="flex items-center gap-4">
                      <button onClick={()=>toggleTask(t.id,t.completed)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${t.completed?"bg-primary border-primary text-primary-foreground":"border-border/40 hover:border-primary/60"}`}>
                        {t.completed&&<Check size={14}/>}
                      </button>
                      <div>
                        <p className={`font-semibold text-sm ${t.completed?"line-through":""}`}>{t.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${t.priority==="High"?"bg-red-400/10 text-red-400":t.priority==="Medium"?"bg-yellow-400/10 text-yellow-400":"bg-accent/10 text-accent"}`}>{t.priority}</span>
                          {t.date&&<span className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10}/> Due: {t.date}</span>}
                        </div>
                      </div>
                    </div>
                    <button onClick={()=>deleteTsk(t.id)} className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14}/></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── TAB: SPECIES ──────────────────────────────────────── */}
        {tab==="Species"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <h2 className="font-display font-bold">Species Database</h2>
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"/>
              <input type="text" placeholder="Search species…" value={speciesSearch} onChange={e=>setSpeciesSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all"/>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSpecies.map(s=>(
                <details key={s.name} className="glass-card p-4 cursor-pointer group">
                  <summary className="flex items-center justify-between list-none">
                    <div className="flex items-center gap-2">
                      <Fish size={14} className={s.type==="Saltwater"?"text-blue-400":"text-accent"}/>
                      <div><p className="font-semibold text-sm">{s.name}</p><p className="text-[11px] text-muted-foreground">{s.type} · {s.care}</p></div>
                    </div>
                    <ChevronDown size={13} className="text-muted-foreground group-open:rotate-180 transition-transform"/>
                  </summary>
                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground border-t border-border/30 pt-3">
                    <p>🌡️ Temp: {s.temp[0]}-{s.temp[1]}°F</p>
                    <p>⚗️ pH: {s.ph[0]}-{s.ph[1]}</p>
                    <p>📏 Adult size: {s.size}</p>
                    <p>🍽 Diet: {s.diet}</p>
                    {s.compat.length>0&&<p className="text-accent">✅ Good with: {s.compat.join(", ")}</p>}
                    {s.incompat.length>0&&<p className="text-red-400">❌ Avoid: {s.incompat.join(", ")}</p>}
                  </div>
                </details>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── TAB: COMPATIBILITY ────────────────────────────────── */}
        {tab==="Compatibility"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-5">
            <h2 className="font-display font-bold">Compatibility Checker</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[{label:"Species A",val:compatA,set:setCompatA},{label:"Species B",val:compatB,set:setCompatB}].map(({label,val,set})=>(
                <div key={label}>
                  <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">{label}</label>
                  <select value={val} onChange={e=>set(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground focus:outline-none focus:border-primary/60 transition-all">
                    <option value="" className="bg-background text-foreground">- Select species -</option>
                    {SPECIES_DB.map(s=><option key={s.name} value={s.name} className="bg-background text-foreground">{s.name} ({s.type})</option>)}
                  </select>
                </div>
              ))}
            </div>
            {compatResult&&(
              <div className="glass-card p-5 space-y-2">
                <h3 className="font-display font-bold text-sm mb-2">{compatA} + {compatB}</h3>
                {compatResult.issues.map((issue,i)=>(
                  <div key={i} className={`p-3 rounded-xl text-sm border ${
                    issue.startsWith("✅")?"bg-accent/10 border-accent/20 text-accent":
                    issue.startsWith("❌")?"bg-red-400/10 border-red-400/20 text-red-400":
                    "bg-yellow-400/10 border-yellow-400/20 text-yellow-400"}`}>{issue}</div>
                ))}
              </div>
            )}
            {compatA&&compatB&&!compatResult&&<div className="glass-card p-5 text-sm text-muted-foreground">One or both species not found in database.</div>}
            {(!compatA||!compatB)&&<div className="glass-card p-10 text-center text-muted-foreground text-sm">Select two species to check compatibility</div>}
          </motion.div>
        )}

        {/* ── TAB: FEEDING ──────────────────────────────────────── */}
        {tab==="Feeding"&&(
          <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold">Feeding Log</h2>
              {ct&&<button onClick={()=>setShowLogFeed(true)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-[var(--shadow-glow-sm)]"><Plus size={13} className="inline mr-1"/>Log Feeding</button>}
            </div>
            {!ct?<div className="text-center py-20 text-muted-foreground">Select a tank first</div>:
            feeding.length===0?<div className="glass-card p-10 text-center text-muted-foreground text-sm">No feeding logs yet</div>:(
              <div className="space-y-2">
                {feeding.map(f=>(
                  <div key={f.id} className="glass-card p-4 flex items-start justify-between group">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0"><Utensils size={13} className="text-primary"/></div>
                      <div>
                        <p className="font-semibold text-sm">{f.food} · {f.amount}</p>
                        {f.notes&&<p className="text-xs text-muted-foreground mt-0.5">{f.notes}</p>}
                        <p className="text-[11px] text-muted-foreground mt-1">{f.loggedAt?.toDate?.()?.toLocaleString?.()??""}</p>
                      </div>
                    </div>
                    <button onClick={()=>deleteFeed(f.id)} className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"><Trash2 size={12}/></button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
      <FishChatbot />
    </div>
  );
};

export default Dashboard;
