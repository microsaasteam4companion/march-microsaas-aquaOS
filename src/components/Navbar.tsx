import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/aquaos-logo-new.png";

const navLinks = [
  { label: "Pricing", href: "/#pricing" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/10 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        <a href="/" className="flex items-center gap-2 group">
          <motion.img
            src={logo}
            alt="AquaOS Logo"
            className="w-9 h-9 object-contain"
            whileHover={{ rotate: 10, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <span className="font-display text-lg font-bold text-gradient-primary">
            AquaOS
          </span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <motion.a
              key={l.label}
              href={l.href}
              onClick={(e) => { 
                if (l.href.startsWith("/#")) {
                  if (location.pathname === "/") {
                    e.preventDefault();
                    document.getElementById(l.href.replace("/#", ""))?.scrollIntoView({ behavior: "smooth" });
                  }
                } else if (l.href.startsWith("/")) { 
                  e.preventDefault(); 
                  navigate(l.href); 
                } 
              }}
              whileHover={{ y: -1 }}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
            >
              {l.label}
            </motion.a>
          ))}
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-2 w-9 h-9 rounded-xl bg-secondary/50 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </motion.button>
          <motion.a
            href="/signup"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="ml-3 px-5 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-[var(--shadow-glow-sm)]"
          >
            Get Started Free
          </motion.a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="p-2 text-muted-foreground"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="text-foreground p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-border/20 bg-background/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => { 
                    if (l.href.startsWith("/#")) {
                      if (location.pathname === "/") {
                        e.preventDefault();
                        document.getElementById(l.href.replace("/#", ""))?.scrollIntoView({ behavior: "smooth" });
                      }
                    } else if (l.href.startsWith("/")) { 
                      e.preventDefault(); 
                      navigate(l.href); 
                    } 
                    setMobileOpen(false); 
                  }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="px-4 py-3 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.a
                href="/signup"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-2 px-5 py-3 text-sm font-semibold rounded-xl bg-primary text-primary-foreground text-center"
                onClick={() => setMobileOpen(false)}
              >
                Get Started Free
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
