import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, FileText, Cookie, Accessibility } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Legal = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const content = {
    privacy: {
      title: "Privacy Policy",
      icon: ShieldCheck,
      text: "At AquaOS, we take your privacy seriously. We collect only the data necessary to provide you with intelligent aquarium management, such as your tank parameters and species lists. We do not sell your data to third parties. All data is encrypted and stored securely using Firebase infrastructure."
    },
    terms: {
      title: "Terms of Service",
      icon: FileText,
      text: "By using AquaOS, you agree to our terms. Our platform is designed as an assistant for aquarium management. While our AI provides recommendations based on established patterns, the ultimate responsibility for the health of your livestock remains with you. AquaOS is not liable for loss of livestock."
    },
    cookies: {
      title: "Cookie Policy",
      icon: Cookie,
      text: "We use essential cookies to keep you logged in and remember your theme preferences. These are necessary for the app to function. We may also use anonymous analytics cookies to help us improve the platform."
    },
    accessibility: {
      title: "Accessibility Statement",
      icon: Accessibility,
      text: "We strive to make AquaOS accessible to everyone. Our interface uses high-contrast colors, scalable typography, and semantic HTML to ensure compatibility with screen readers and assistive technologies."
    }
  };

  const getPath = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes("privacy")) return "privacy";
    if (p.includes("terms")) return "terms";
    if (p.includes("cookies")) return "cookies";
    if (p.includes("accessibility")) return "accessibility";
    return "privacy";
  };

  const current = content[getPath() as keyof typeof content];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-20 container mx-auto px-4 max-w-3xl">
        <motion.button 
          onClick={() => navigate("/")}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 sm:p-12"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <current.icon size={24} />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-6">{current.title}</h1>
          <div className="prose prose-invert max-w-none">
            <p className="text-muted-foreground leading-loose text-lg">
              {current.text}
            </p>
            <p className="text-muted-foreground leading-loose mt-4">
              Last updated: March 12, 2026. This is a simplified legal overview as requested.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Legal;
