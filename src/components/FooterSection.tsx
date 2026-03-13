import { motion } from "framer-motion";
import { ArrowRight, Mail, MapPin, Phone, Youtube, Twitter, Instagram, Facebook, Github, Linkedin, MessageSquare, Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/aquaos-logo-new.png";
import ctaImg from "@/assets/cta-underwater.jpg";
import BubbleEffect from "./BubbleEffect";

const footerLinks = {
  Product: [
    { label: "Blog", href: "/blog" },
    { label: "Petvault", href: "https://petvault.entrext.com/" },
    { label: "Pawnote", href: "https://pawnote.entrext.com" },
  ],
  Resources: [
    { label: "Community Forum (Substack)", href: "https://entrextlabs.substack.com/subscribe" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  { icon: Linkedin, href: "https://www.linkedin.com/company/entrext/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/entrext.labs/", label: "Instagram" },
  { icon: MessageSquare, href: "https://discord.com/invite/ZZx3cBrx2", label: "Discord" },
  { icon: Newspaper, href: "https://entrextlabs.substack.com/subscribe", label: "Substack" },
];

const FooterSection = () => {
  return (
    <footer className="relative border-t border-border/20 overflow-hidden">
      {/* CTA Banner - Underwater Aquarium Theme */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden"
          style={{ borderRadius: "3rem 3rem 6rem 6rem" }}
        >
          {/* Underwater background */}
          <div className="absolute inset-0">
            <img src={ctaImg} alt="" className="w-full h-full object-cover saturate-[1.4] contrast-[1.15] brightness-[0.95]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/15 to-background/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/15 via-transparent to-background/15" />
          </div>

          {/* Animated swimming fish */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ x: ["-10%", "110%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="absolute top-[25%] text-3xl opacity-60"
            >🐠</motion.div>
            <motion.div
              animate={{ x: ["110%", "-10%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 3 }}
              className="absolute top-[45%] text-2xl opacity-50"
            >🐟</motion.div>
            <motion.div
              animate={{ x: ["-10%", "110%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 6 }}
              className="absolute top-[65%] text-4xl opacity-40"
            >🐡</motion.div>
          </div>

          {/* Curvy SVG wave at top */}
          <svg className="absolute top-0 left-0 right-0 w-full" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" style={{ height: "80px" }}>
            <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,30 1440,60 L1440,0 L0,0 Z" fill="hsl(var(--background))" />
          </svg>

          {/* Curvy SVG wave at bottom */}
          <svg className="absolute bottom-0 left-0 right-0 w-full rotate-180" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none" style={{ height: "80px" }}>
            <path d="M0,60 C240,0 480,120 720,60 C960,0 1200,120 1440,60 L1440,0 L0,0 Z" fill="hsl(var(--background))" />
          </svg>

          {/* Bubble particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <BubbleEffect />
          </div>

          {/* Floating plant silhouettes on sides */}
          <div className="absolute bottom-0 left-0 w-40 h-64 opacity-20 pointer-events-none">
            <svg viewBox="0 0 160 260" className="w-full h-full">
              <path d="M80,260 Q60,200 40,180 Q20,160 30,120 Q40,80 20,40 Q10,20 25,0" stroke="hsl(var(--accent))" strokeWidth="3" fill="none" />
              <path d="M80,260 Q90,210 100,180 Q110,150 95,100 Q80,60 100,20" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
              <ellipse cx="30" cy="120" rx="25" ry="15" fill="hsl(var(--accent) / 0.3)" />
              <ellipse cx="95" cy="100" rx="20" ry="12" fill="hsl(var(--primary) / 0.2)" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-64 opacity-20 pointer-events-none scale-x-[-1]">
            <svg viewBox="0 0 160 260" className="w-full h-full">
              <path d="M80,260 Q60,200 40,180 Q20,160 30,120 Q40,80 20,40 Q10,20 25,0" stroke="hsl(var(--accent))" strokeWidth="3" fill="none" />
              <path d="M80,260 Q90,210 100,180 Q110,150 95,100 Q80,60 100,20" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="relative z-10 py-24 sm:py-32 px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white [text-shadow:_0_2px_20px_rgb(0_0_0_/_50%),_0_4px_40px_rgb(0_0_0_/_30%)]"
            >
              Ready to stop{" "}
              <motion.span
                className="text-primary inline-block [text-shadow:_0_0_30px_hsl(175_85%_45%_/_0.5)]"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                losing fish
              </motion.span>
              ?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 }}
              className="text-white/85 text-lg max-w-lg mx-auto mb-10 [text-shadow:_0_1px_10px_rgb(0_0_0_/_50%)]"
            >
              Join thousands of aquarists who trust AquaOS to keep their tanks thriving.
            </motion.p>
            <motion.a
              href="/signup"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 }}
              whileHover={{ scale: 1.06, boxShadow: "0 0 80px -10px hsl(175 85% 45% / 0.6)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center gap-2 px-12 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-[var(--shadow-glow)] overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ opacity: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
              </span>
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6 mb-16">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2 pr-8">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logo} alt="AquaOS" className="w-9 h-9 object-contain" />
              <span className="font-display text-xl font-bold text-gradient-primary">AquaOS</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              The world's most intelligent aquarium management platform. AI-powered water chemistry, species compatibility, disease diagnosis, and tank planning - all in one beautiful app.
            </p>
            <div className="space-y-3 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2.5">
                <Mail size={14} className="text-primary/60" /> contact@entrext.com
              </div>
            </div>
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-display font-bold text-sm mb-4 text-foreground">{section}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="glass-card p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h4 className="font-display font-bold text-base mb-1">Stay in the loop</h4>
              <p className="text-sm text-muted-foreground">Weekly tips, species spotlights, and product updates. No spam.</p>
            </div>
            <form action="https://entrextlabs.substack.com/subscribe" method="GET" target="_blank" className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-56 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                required
              />
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-[var(--shadow-glow-sm)]">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <p className="text-xs text-muted-foreground">
            © 2026 AquaOS Inc. All rights reserved. Built for aquarists, by aquarists.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            AquaOS by Entrext Labs
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
