import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import BubbleEffect from "./BubbleEffect";
import heroImg from "@/assets/hero-aquarium.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[110vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Full-bleed background */}
      <div className="absolute inset-0 z-0">
        <img src={heroImg} alt="" className="w-full h-full object-cover saturate-[1.2] contrast-[1.1] brightness-[0.8] sm:brightness-[0.95]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      </div>

      {/* Animated water caustics */}
      <div className="absolute inset-0 water-caustics pointer-events-none" />

      {/* Floating orbs */}
      <div className="orb orb-primary w-[700px] h-[500px] top-[5%] left-[5%] animate-float" />
      <div className="orb orb-blue w-[500px] h-[400px] top-[20%] right-[0%] animate-float-delayed" />
      <div className="orb orb-accent w-[400px] h-[300px] bottom-[15%] left-[30%] animate-float-slow" />

      <BubbleEffect />


      <motion.div
        style={{ y: contentY, opacity }}
        className="relative z-10 container mx-auto px-4 text-center"
      >
        {/* Main heading */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-8 max-w-5xl mx-auto text-white [text-shadow:_0_2px_20px_rgb(0_0_0_/_50%),_0_4px_40px_rgb(0_0_0_/_30%)]"
        >
          {["The", "Smartest", "Way"].map((word, i) => (
            <motion.span
              key={word}
              initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.3em]"
            >
              {word}
            </motion.span>
          ))}
          <br className="hidden sm:block" />
          <motion.span
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="inline-block text-primary [text-shadow:_0_0_30px_hsl(175_85%_45%_/_0.5)]"
          >
            to Keep Fish
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="inline-block ml-[0.3em]"
          >
            Alive
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed [text-shadow:_0_1px_10px_rgb(0_0_0_/_60%),_0_2px_20px_rgb(0_0_0_/_30%)]"
        >
          AquaOS tracks your water parameters, identifies diseases, checks fish compatibility, and tells you exactly what to do <span className="font-bold">before your tank crashes.</span>
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.06, boxShadow: "0 0 80px -10px hsl(175 85% 45% / 0.6)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg transition-all shadow-[0_0_40px_-8px_hsl(175_85%_45%/0.5)] flex items-center gap-3 overflow-hidden border border-primary/20"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent"
              animate={{ x: ["-200%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
            <span className="relative z-10 flex items-center gap-2">
              Start Free
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </motion.a>
        </motion.div>

      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
