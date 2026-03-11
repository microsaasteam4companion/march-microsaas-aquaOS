import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "What is New Tank Syndrome?", a: "New Tank Syndrome occurs when fish are added to an uncycled aquarium. Without beneficial bacteria to convert toxic ammonia to less harmful nitrate, ammonia levels spike and can kill fish within hours. The nitrogen cycle takes 4-8 weeks to establish naturally." },
  { q: "How often should I change my water?", a: "For most freshwater tanks, a 20-30% water change weekly is ideal. However, this depends on your bioload, filtration, and parameter readings. AquaOS's predictive engine can calculate your optimal schedule based on real data." },
  { q: "Why do my fish keep dying?", a: "The most common causes are: uncycled tank (ammonia/nitrite poisoning), incompatible species, overstocking, sudden pH or temperature changes, and overfeeding. Proper monitoring with AquaOS prevents all of these." },
  { q: "Is the '1 inch per gallon' rule accurate?", a: "No — it's dangerously oversimplified. A 10-inch Oscar produces far more waste than ten 1-inch neon tetras. Bioload depends on fish metabolism, waste production, and filtration capacity. Our stocking calculator uses real bioload data." },
  { q: "How do I know if my tank is cycled?", a: "A fully cycled tank shows 0 ppm ammonia, 0 ppm nitrite, and some level of nitrate (5-20 ppm). AquaOS's cycling tracker monitors your daily readings and tells you exactly where you are in the process." },
  { q: "Can I keep saltwater fish as a beginner?", a: "Saltwater is more demanding but not impossible for dedicated beginners. Start with a larger tank (40+ gallons), hardy species like clownfish, and invest in quality equipment. AquaOS has specific guides for saltwater beginners." },
  { q: "How does the AI Disease Photo Identifier work?", a: "Snap a photo of your fish showing symptoms. Our AI analyzes visual patterns — white spots (ich), frayed fins (fin rot), gold dust (velvet), and more. It provides a differential diagnosis with treatment protocol and exact medication dosing." },
  { q: "What makes AquaOS different from other aquarium apps?", a: "We're the only platform combining AI water chemistry, disease diagnosis, species compatibility, and tank planning in one app. Most alternatives handle only one of these. Plus, our core features are free forever." },
];

const FAQsSection = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faqs" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 water-caustics opacity-20 pointer-events-none" />
      <div className="orb orb-accent w-[400px] h-[300px] top-[10%] right-[-8%] animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
              FAQ
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked{" "}
              <span className="text-gradient-primary">Questions</span>
            </h2>
            <p className="text-muted-foreground text-sm">Quick answers to the questions we hear most.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left group"
                >
                  <span className="font-display font-semibold text-sm pr-4 group-hover:text-primary transition-colors">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180 text-primary" : ""}`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQsSection;
