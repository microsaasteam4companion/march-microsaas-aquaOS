import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, FlaskConical, BarChart3, Fish, Search, BookOpen } from "lucide-react";
import fishSchool from "@/assets/fish-school.jpg";
import plantsImg from "@/assets/plants-underwater.jpg";
import reefImg from "@/assets/reef-scene.jpg";
import fishBetta from "@/assets/fish-betta.jpg";

const howItWorks = [
  { step: "01", title: "Log Your Water", desc: "Enter pH, ammonia, nitrite, nitrate, temperature — takes 30 seconds after each test.", image: plantsImg },
  { step: "02", title: "Get AI Insights", desc: "AquaOS analyzes your data, identifies trends, and tells you exactly what to do next.", image: fishBetta },
  { step: "03", title: "Watch Fish Thrive", desc: "Prevent crashes, avoid disease, and build the aquarium you've always dreamed of.", image: reefImg },
];

const freeFeatures = [
  { icon: FlaskConical, title: "Cycling Guide & Tracker", desc: "Day-by-day nitrogen cycle tracker with plain English explanations. Know exactly when it's safe to add fish.", image: plantsImg },
  { icon: BarChart3, title: "Water Parameter Logger", desc: "Beautiful trend charts for pH, ammonia, nitrite, nitrate, temperature, hardness, and salinity.", image: null },
  { icon: Fish, title: "Compatibility Checker", desc: "Instant verdicts — checks pH, temp range, aggression, territory, swimming level, and size.", image: fishSchool },
  { icon: Search, title: "Stocking Calculator", desc: "See bioload %, overstocking warnings, and safe addition recommendations. Beyond the '1 inch per gallon' myth.", image: null },
  { icon: BookOpen, title: "Species Database", desc: "700+ freshwater, saltwater, and invertebrate profiles with care difficulty, diet, and compatible tank mates.", image: reefImg },
];

import {
  Brain, Camera, LayoutDashboard, Pill, Droplets, CalendarDays, Leaf, Bell, LineChart, Heart, ShoppingCart, DollarSign,
  type LucideIcon,
} from "lucide-react";

const premiumFeatures: { icon: LucideIcon; title: string; desc: string; highlight?: string }[] = [
  { icon: Brain, title: "AI Water Chemistry", desc: "Enter params → get step-by-step corrective actions. Not just alerts — actual solutions.", highlight: "Most Used" },
  { icon: Camera, title: "Disease Photo ID", desc: "Snap a photo → AI identifies ich, fin rot, columnaris, velvet, swim bladder disorder, and dropsy with treatment protocols.", highlight: "AI Powered" },
  { icon: LayoutDashboard, title: "AI Tank Planner", desc: "Input tank size, water type, experience level → get a complete stocking plan with compatible fish, plants, substrate, and filtration." },
  { icon: Pill, title: "Medication Dosing", desc: "Any medication + tank volume (accounting for substrate displacement) = exact dose. Prevents overdose deaths." },
  { icon: Droplets, title: "Multi-Tank Manager", desc: "Manage 2–50+ tanks from one unified dashboard with separate logs, stocking lists, and maintenance schedules." },
  { icon: CalendarDays, title: "Smart Maintenance", desc: "AI schedules water changes, filter cleaning, and equipment replacement based on your actual bioload and parameter history." },
  { icon: Leaf, title: "Plant Care Module", desc: "NPK fertilizer calculator, CO2 requirements by species, lighting guide, and algae cause-and-effect diagnosis." },
  { icon: Bell, title: "Store Inventory Alerts", desc: "Save wishlist fish → get notified when local stores or online retailers have them in stock." },
  { icon: LineChart, title: "Predictive Water Changes", desc: "Predicts when nitrates hit threshold based on bioload, feeding, and history. Removes guesswork." },
  { icon: Heart, title: "Breeding Tracker", desc: "Pair logs, spawn dates, fry count, feeding schedules, grow-out tank management, and survival rate tracking." },
  { icon: ShoppingCart, title: "Community Trade Board", desc: "Local fish swap listings. Connect with hobbyists in your area to buy, sell, and trade livestock." },
  { icon: DollarSign, title: "Expense & ROI Tracker", desc: "Log all equipment, livestock, food, and medication costs per tank. Know exactly what you've invested." },
];

const FeaturesSection = () => {
  const [activePremium, setActivePremium] = useState(0);
  const active = premiumFeatures[activePremium];

  return (
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 water-caustics opacity-30 pointer-events-none" />
      <div className="orb orb-accent w-[600px] h-[500px] top-[10%] right-[-15%] animate-float-slow" />
      <div className="orb orb-primary w-[500px] h-[400px] bottom-[20%] left-[-10%] animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">

        {/* ===== HOW IT WORKS ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            Three steps to a <span className="text-gradient-primary">thriving tank</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-40 max-w-6xl mx-auto">
          {howItWorks.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="group relative">
              <div className="glass-card overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <motion.img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <span className="absolute top-4 left-4 font-display text-5xl font-bold text-primary/20">{item.step}</span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
              {i < 2 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/30 to-transparent" />}
            </motion.div>
          ))}
        </div>

        {/* ===== FREE FEATURES ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" /> Free Forever
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            Everything to <span className="text-gradient-primary">keep fish alive</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">The essential toolkit every aquarist needs — completely free.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-40 max-w-6xl mx-auto">
          {freeFeatures.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group glass-card card-hover-glow overflow-hidden ${i === 0 ? "lg:col-span-2" : ""} ${i === 4 ? "lg:col-span-2" : ""}`}
            >
              {f.image && (
                <div className="relative h-40 overflow-hidden">
                  <motion.img src={f.image} alt={f.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
              )}
              <div className="p-6">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                  <f.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ===== PREMIUM FEATURES — Interactive Showcase ===== */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-glow-warning/20 bg-glow-warning/5 text-glow-warning text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-glow-warning animate-pulse" /> Premium
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            AI-powered <span className="text-gradient-gold">superpowers</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Click any feature to explore what Premium unlocks.</p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Left: Feature list */}
            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-2 scrollbar-hide">
              {premiumFeatures.map((f, i) => (
                <motion.button
                  key={f.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  onClick={() => setActivePremium(i)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-300 ${
                    activePremium === i
                      ? "bg-glow-warning/10 border border-glow-warning/30 shadow-[0_0_20px_-5px_hsl(42_100%_62%/0.2)]"
                      : "hover:bg-secondary/40 border border-transparent"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                    activePremium === i ? "bg-glow-warning/20" : "bg-secondary/50"
                  }`}>
                    <f.icon size={16} className={activePremium === i ? "text-glow-warning" : "text-muted-foreground"} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold truncate ${activePremium === i ? "text-foreground" : "text-muted-foreground"}`}>
                        {f.title}
                      </span>
                      {f.highlight && activePremium === i && (
                        <span className="px-2 py-0.5 rounded-full bg-glow-warning/15 text-glow-warning text-[9px] font-bold shrink-0">
                          {f.highlight}
                        </span>
                      )}
                    </div>
                  </div>
                  {activePremium === i && (
                    <ArrowRight size={14} className="ml-auto text-glow-warning shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Right: Detail card */}
            <motion.div
              key={activePremium}
              initial={{ opacity: 0, x: 20, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card glow-border overflow-hidden flex flex-col"
            >
              {/* Image area */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={[fishBetta, reefImg, plantsImg, fishSchool, fishBetta, reefImg, plantsImg, fishSchool, fishBetta, reefImg, plantsImg, fishSchool][activePremium % 4]}
                  alt={active.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  {active.highlight && (
                    <span className="px-3 py-1 rounded-full bg-glow-warning/20 text-glow-warning text-xs font-bold backdrop-blur-sm border border-glow-warning/20">
                      {active.highlight}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-glow-warning/10 flex items-center justify-center mb-5">
                  <active.icon size={26} className="text-glow-warning" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{active.title}</h3>
                <p className="text-muted-foreground leading-relaxed flex-1">{active.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-sm text-glow-warning font-medium">
                  <ArrowRight size={14} />
                  <span>Available with Premium — $9/mo</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
