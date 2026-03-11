import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Droplets, Thermometer, TestTube, AlertTriangle, Fish, TrendingUp, TrendingDown, Activity } from "lucide-react";
import dashboardImg from "@/assets/dashboard-preview.jpg";

const params = [
  { label: "pH", value: 7.2, unit: undefined, icon: TestTube, trend: "stable" as const, color: "primary" },
  { label: "Ammonia", value: 0.0, unit: "ppm", icon: Droplets, trend: "down" as const, color: "accent" },
  { label: "Nitrite", value: 0.0, unit: "ppm", icon: Droplets, trend: "down" as const, color: "accent" },
  { label: "Nitrate", value: 15, unit: "ppm", icon: Activity, trend: "up" as const, color: "warning" },
  { label: "Temp", value: 78, unit: "°F", icon: Thermometer, trend: "stable" as const, color: "blue" },
];

const fishList = [
  { name: "Neon Tetra", count: 12, health: "healthy", emoji: "🐟" },
  { name: "Corydoras", count: 6, health: "healthy", emoji: "🐠" },
  { name: "Betta", count: 1, health: "watch", emoji: "🐡" },
  { name: "Cherry Shrimp", count: 15, health: "healthy", emoji: "🦐" },
];

const chartData = [4, 6, 8, 5, 7, 10, 8, 6, 9, 12, 10, 8, 11, 14, 12, 10, 13, 15, 13, 11, 9, 12, 14, 13, 11, 10, 13, 15, 14, 15];

const LiveValue = ({ value, unit, isInView }: { value: number; unit?: string; isInView: boolean }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    const dur = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Number((e * value).toFixed(1)));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span className="text-2xl font-display font-bold tabular-nums">
      {display % 1 === 0 ? display.toFixed(0) : display.toFixed(1)}
      {unit && <span className="text-xs text-muted-foreground ml-0.5">{unit}</span>}
    </span>
  );
};

const DashboardPreview = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [bioload, setBioload] = useState(0);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setBioload((prev) => {
            if (prev >= 68) { clearInterval(interval); return 68; }
            return prev + 1;
          });
        }, 20);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section id="dashboard" className="relative py-32 overflow-hidden">
      <div className="orb orb-blue w-[600px] h-[500px] top-[10%] right-[-15%] animate-float" />
      <div className="orb orb-primary w-[400px] h-[400px] bottom-[5%] left-[-10%] animate-float-delayed" />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            Your aquarium{" "}
            <span className="text-gradient-primary">command center</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every parameter, every fish, every trend — beautifully visualized.
          </p>
        </motion.div>

        {/* Dashboard image showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95, rotateX: 5 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div className="relative rounded-3xl overflow-hidden glow-border">
            <img src={dashboardImg} alt="AquaOS Dashboard" className="w-full h-auto" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        </motion.div>

        {/* Live dashboard */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl mx-auto"
        >
          <div className="glass-card glow-border p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display text-lg font-semibold">🐠 Living Room Reef</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">75 gal</span>
                </div>
                <p className="text-sm text-muted-foreground">Cycle Day 42 · All parameters within range</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-accent" />
                Healthy
              </motion.div>
            </div>

            {/* Params */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
              {params.map((p, i) => (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="rounded-xl bg-secondary/40 border border-border/40 p-4 hover:border-primary/20 transition-all cursor-default"
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2">
                    <p.icon size={12} />
                    {p.label}
                  </div>
                  <LiveValue value={p.value} unit={p.unit} isInView={isInView} />
                  <div className="flex items-center gap-1.5 mt-2 text-xs">
                    {p.trend === "up" ? <TrendingUp size={11} className="text-glow-warning" /> :
                     p.trend === "down" ? <TrendingDown size={11} className="text-accent" /> :
                     <span className="w-3 h-0.5 rounded bg-muted-foreground/30" />}
                    <span className="text-muted-foreground capitalize">{p.trend}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Nitrate Trend · 30 days</span>
                <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-xs text-accent font-medium">
                  Next water change in 4 days
                </motion.span>
              </div>
              <div className="h-24 flex items-end gap-[3px]">
                {chartData.map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm relative group cursor-crosshair"
                    initial={{ height: 0 }}
                    animate={isInView ? { height: `${(v / 20) * 100}%` } : { height: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      background: `hsl(${v > 18 ? "0 72% 51%" : v > 14 ? "42 100% 62%" : "175 85% 45%"} / ${0.3 + (v / 20) * 0.5})`,
                    }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-card text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-border/50 pointer-events-none z-10">
                      {v} ppm
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Fish list */}
            <div className="rounded-xl bg-secondary/20 border border-border/30 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Livestock · {fishList.reduce((a, f) => a + f.count, 0)} total
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Bioload</span>
                  <div className="w-24 h-2 rounded-full bg-secondary overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-primary"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: "68%" } : {}}
                      transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="text-xs font-mono text-accent">{bioload}%</span>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {fishList.map((f, i) => (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between rounded-lg bg-muted/20 px-4 py-3 hover:bg-muted/40 transition-colors cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{f.emoji}</span>
                      <span className="text-sm font-medium">{f.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground font-mono">×{f.count}</span>
                      {f.health === "watch" ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                          <AlertTriangle size={14} className="text-glow-warning" />
                        </motion.div>
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-accent/80" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
