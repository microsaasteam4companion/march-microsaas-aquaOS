import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Fish, Camera, Image as ImageIcon, Trash2 } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

const SYSTEM_PROMPT = `You are AquaBot, an expert aquarium and fishkeeping assistant built into the AquaOS dashboard app.

You specialize in:
- Freshwater and saltwater fish care
- Water chemistry (pH, ammonia, nitrite, nitrate, temperature, salinity)
- Nitrogen cycle explanation
- Fish disease diagnosis and treatment
- Species compatibility checks
- Tank cycling, filtration, equipment
- Coral and invertebrate care
- Planted tank advice
- Feeding schedules

Rules:
- Be friendly, concise, and practical
- Use emojis sparingly but effectively
- Format with **bold** for key terms
- Give actionable advice with numbered steps when appropriate
- If a fish is in danger, prioritize urgent action steps
- Keep responses under 200 words unless detail is truly needed
- Always mention if something requires immediate action`;

interface Msg { role: "user" | "bot"; text: string; }

const SUGGESTED = [
  "How do I cycle a new tank?",
  "My ammonia is 0.5 ppm — help!",
  "Betta fish complete care guide",
  "How often should I do water changes?",
  "What coral should I start with?",
];

export const FishChatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "🐠 Hi! I'm **AquaBot**, your AI fish care assistant.\n\nAsk me anything about aquariums, fish health, water chemistry, species compatibility and more!" }
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const initChat = () => {
    if (!chatRef.current && API_KEY) {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      chatRef.current = model.startChat({
        history: [{ role: "user", parts: [{ text: SYSTEM_PROMPT }] }, { role: "model", parts: [{ text: "Understood! I'm AquaBot, ready to help with all aquarium questions." }] }],
      });
    }
  };

  const fileToGenerativePart = async (base64Str: string) => {
    return {
      inlineData: {
        data: base64Str.split(",")[1],
        mimeType: base64Str.split(",")[0].split(":")[1].split(";")[0]
      },
    };
  };

  const send = async (text = input) => {
    const q = text.trim();
    if (!q && !selectedImage || loading) return;
    
    const currentImage = selectedImage;
    setInput("");
    setSelectedImage(null);
    
    setMessages(p => [...p, { role: "user", text: q || "Analying image..." }]);
    setLoading(true);

    try {
      if (!API_KEY) throw new Error("NO_KEY");
      
      const genAI = new GoogleGenerativeAI(API_KEY);
      // Switching to gemini-1.5-flash-latest for better compatibility
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      
      let result;
      if (currentImage) {
        const imagePart = await fileToGenerativePart(currentImage);
        result = await model.generateContent([q || "What is in this image related to fish/aquariums?", imagePart]);
      } else {
        if (!chatRef.current) {
          chatRef.current = model.startChat({
            history: [{ role: "user", parts: [{ text: SYSTEM_PROMPT }] }, { role: "model", parts: [{ text: "Understood! I'm AquaBot, ready to help with all aquarium questions." }] }],
          });
        }
        result = await chatRef.current.sendMessage(q);
      }
      
      const reply = result.response.text();
      setMessages(p => [...p, { role: "bot", text: reply }]);
    } catch (err: any) {
      console.error("Chatbot Error:", err);
      const fallback = err.message === "NO_KEY"
        ? "⚠️ AI mode needs a Gemini API key.\n\nAdd **VITE_GEMINI_API_KEY** to your `.env` file.\n\nGet a free key at: **aistudio.google.com**"
        : "😕 Couldn't reach AI right now. Please check your API key in Vercel settings and ensure you have 'Gemini 1.5 Flash' enabled in AI Studio.";
      setMessages(p => [...p, { role: "bot", text: fallback }]);
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const renderText = (text: string) =>
    text.split("**").map((part, j) =>
      j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
    );

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-center gap-2 group">
        <div className="absolute -top-10 left-0 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Fish Assistant
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-14 h-14 rounded-2xl bg-primary shadow-[var(--shadow-glow)] flex items-center justify-center text-primary-foreground hover:scale-105 active:scale-95 transition-all"
        >
        <AnimatePresence mode="wait">
          {open
            ? <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.span>
            : <motion.span key="c" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={22} /></motion.span>
          }
        </AnimatePresence>
      </button>
    </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="fixed bottom-24 left-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-border/50 bg-[hsl(var(--card))] shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "520px" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/30 bg-primary/10 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                <Fish size={16} className="text-primary" />
              </div>
              <div>
                <p className="font-display font-bold text-sm">AquaBot 🐠</p>
                <p className="text-[11px] text-muted-foreground">Powered by Gemini AI</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${API_KEY ? "bg-accent animate-pulse" : "bg-yellow-400"}`} />
                <span className={`text-[11px] font-semibold ${API_KEY ? "text-accent" : "text-yellow-400"}`}>
                  {API_KEY ? "AI Active" : "No API Key"}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-secondary/60 border border-border/30 rounded-bl-sm text-foreground"
                  }`}>
                    {renderText(m.text)}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-secondary/60 border border-border/30 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-[11px] px-2.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all font-medium">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="border-t border-border/30 shrink-0 bg-background/50">
              <AnimatePresence>
                {selectedImage && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="px-4 py-2 flex items-center gap-2 border-b border-border/20">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border/40">
                      <img src={selectedImage} alt="Upload preview" className="w-full h-full object-cover" />
                      <button onClick={() => setSelectedImage(null)} className="absolute top-0 right-0 bg-black/60 p-0.5 rounded-bl-lg text-white">
                        <Trash2 size={10} />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate flex-1">Image ready for analysis...</p>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="flex items-center gap-2 px-4 py-3">
                <input type="file" accept="image/*" hidden ref={fileInputRef} onChange={onFileChange} />
                <button onClick={() => fileInputRef.current?.click()} className="w-10 h-10 rounded-xl bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-primary transition-all shrink-0">
                  <Camera size={18} />
                </button>
                
                <input
                  type="text"
                  placeholder={selectedImage ? "Describe what to check..." : "Ask AquaBot about fish..."}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  disabled={loading}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-secondary/40 border border-border/40 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
                />
                <button onClick={() => send()} disabled={loading || (!input.trim() && !selectedImage)}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 transition-all shrink-0 shadow-[var(--shadow-glow-sm)] disabled:opacity-40">
                  <Send size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
