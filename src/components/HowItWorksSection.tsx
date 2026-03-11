import { motion } from "framer-motion";
import plantsImg from "@/assets/plants-underwater.jpg";
import fishBetta from "@/assets/fish-betta.jpg";
import reefImg from "@/assets/reef-scene.jpg";

const howItWorks = [
  { step: "01", title: "Log Your Water", desc: "Enter pH, ammonia, nitrite, nitrate, temperature — takes 30 seconds after each test.", image: plantsImg },
  { step: "02", title: "Get AI Insights", desc: "AquaOS analyzes your data, identifies trends, and tells you exactly what to do next.", image: fishBetta },
  { step: "03", title: "Watch Fish Thrive", desc: "Prevent crashes, avoid disease, and build the aquarium you've always dreamed of.", image: reefImg },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 water-caustics opacity-30 pointer-events-none" />
      <div className="orb orb-accent w-[600px] h-[500px] top-[10%] right-[-15%] animate-float-slow" />
      <div className="orb orb-primary w-[500px] h-[400px] bottom-[20%] left-[-10%] animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            How It Works
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            Three steps to a <span className="text-gradient-primary">thriving tank</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {howItWorks.map((item, i) => (
            <motion.div key={item.step} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.15 }} className="group relative">
              <div className="glass-card overflow-hidden">
                <div className="relative h-56 sm:h-48 overflow-hidden">
                  <motion.img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
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
      </div>
    </section>
  );
};

export default HowItWorksSection;
