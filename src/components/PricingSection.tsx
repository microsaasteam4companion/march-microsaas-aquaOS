import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import fishSchool from "@/assets/fish-school.jpg";

const free = [
  "Comprehensive Species Database (800+)",
  "Water Parameter Logging & Charts",
  "Smart Parameter Alerts",
  "Fish Compatibility Checker",
  "Tank Management (Up to 3 tanks)",
  "Basic Maintenance Reminders",
];

const premium = [
  "Everything in Free",
  "AI Vision: Fish Disease Identification",
  "Premium Generative AI Advisor",
  "Advanced Parameter Analytics",
  "Unlimited Tank Management",
  "Priority Task & Reminder Syncing",
  "Full Species Biology Explorer",
];

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-32 overflow-hidden" ref={ref}>
      {/* Background image accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1/2 h-full opacity-[0.04]">
          <img src={fishSchool} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background to-background/95" />
      </div>
      <div className="orb orb-primary w-[500px] h-[400px] top-[20%] left-[-10%] animate-float-slow" />
      <div className="orb orb-accent w-[400px] h-[300px] bottom-[10%] right-[-5%] animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            Simple, honest{" "}
            <span className="text-gradient-primary">pricing</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
            Start free. Upgrade when your tanks need AI superpowers.
          </p>

          <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl bg-secondary/50 border border-border/30 backdrop-blur-sm">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                !annual ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-sm)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                annual ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-sm)]" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                annual ? "bg-primary-foreground/20" : "bg-accent/10 text-accent"
              }`}>-27%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-8 sm:p-10 flex flex-col card-hover-glow"
          >
            <h3 className="font-display text-2xl font-bold mb-1">Free</h3>
            <p className="text-muted-foreground text-sm mb-8">
              Everything to keep your first tank thriving.
            </p>
            <div className="mb-10">
              <span className="text-6xl font-display font-bold">$0</span>
              <span className="text-base text-muted-foreground ml-2">/forever</span>
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {free.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-accent" />
                  </div>
                  <span className="text-secondary-foreground">{f}</span>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block text-center py-4 rounded-2xl border border-border/50 text-foreground font-bold hover:bg-secondary/50 hover:border-primary/20 transition-all"
            >
              Get Started Free
            </motion.a>
          </motion.div>

          {/* Premium */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card glow-border p-8 sm:p-10 flex flex-col relative mt-6"
          >

            <h3 className="font-display text-2xl font-bold mb-1">Premium</h3>
            <p className="text-muted-foreground text-sm mb-8">AI-powered tools for serious aquarists.</p>
            <div className="mb-2">
              <motion.span
                key={annual ? "a" : "m"}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-display font-bold"
              >
                ${annual ? "6.58" : "9"}
              </motion.span>
              <span className="text-base text-muted-foreground ml-2">/month</span>
            </div>
            <p className="text-xs text-muted-foreground mb-10">{annual ? "Billed $79/year" : "or $79/year (save 27%)"}</p>
            <ul className="space-y-3.5 mb-10 flex-1">
              {premium.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.04 }}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-primary" />
                  </div>
                  <span className="text-secondary-foreground">{f}</span>
                </motion.li>
              ))}
            </ul>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.02, boxShadow: "0 0 60px -10px hsl(175 85% 45% / 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center justify-center gap-2 text-center py-4 rounded-2xl bg-primary text-primary-foreground font-bold transition-all shadow-[var(--shadow-glow)]"
            >
              Start 14-Day Free Trial
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
