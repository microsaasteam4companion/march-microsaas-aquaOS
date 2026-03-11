import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, ChevronRight, Clock, User, Tag, Search, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-aquarium.jpg";
import fishBetta from "@/assets/fish-betta.jpg";
import fishSchool from "@/assets/fish-school.jpg";
import plantsImg from "@/assets/plants-underwater.jpg";
import reefImg from "@/assets/reef-scene.jpg";

const blogImages = [heroImg, fishBetta, fishSchool, plantsImg, reefImg];

const categories = [
  "All", "Beginner Guides", "Water Chemistry", "Fish Health", "Plant Care",
  "Equipment", "Saltwater", "Freshwater", "Breeding", "Tank Setup",
];

const generateBlogs = () => {
  const titles = [
    "Complete Guide to the Nitrogen Cycle", "How to Cure Ich Naturally", "Best Beginner Fish for a 10-Gallon Tank",
    "Understanding pH and Why It Matters", "Planted Tank Lighting Guide", "Top 10 Peaceful Community Fish",
    "Saltwater vs Freshwater: Which Is Right?", "How to Lower Ammonia Fast", "Betta Fish Care 101",
    "Setting Up Your First Reef Tank", "CO2 Injection Explained", "Common Fish Diseases & Treatments",
    "Aquascaping for Beginners", "Water Change Schedule Guide", "Breeding Guppies Successfully",
    "Best Canister Filters 2026", "Live Plants That Grow in Low Light", "Cycling a Tank in 2 Weeks",
    "Corydoras Care Guide", "Why Your Fish Keep Dying", "Algae Types & How to Beat Them",
    "Shrimp Keeping 101", "Discus Fish: Expert Guide", "Best Substrate for Planted Tanks",
    "How to Quarantine New Fish", "African Cichlid Setup Guide", "Feeding Schedule Optimization",
    "Tank Maintenance Checklist", "Nano Tank Ideas Under 5 Gallons", "Understanding GH and KH",
    "Driftwood Preparation Guide", "Best LED Lights for Aquariums", "How to Reduce Nitrates Naturally",
    "Snail Guide: Friend or Foe?", "Angelfish Compatibility Chart", "RO Water for Aquariums",
    "How to Build a Paludarium", "Fishless Cycling Method", "Treating Fin Rot Effectively",
    "Brackish Water Setup Guide", "Best Air Pumps Reviewed", "Goldfish Myths Debunked",
    "How to Move a Fish Tank", "Sump Filter Setup Guide", "Cherry Shrimp Breeding Guide",
    "Aquarium Photography Tips", "DIY CO2 Reactor Build", "Hospital Tank Setup",
    "Understanding Biofilm", "Best Foods for Color Enhancement",
  ];
  const cats = categories.slice(1);
  const authors = ["Dr. Sarah Chen", "Marcus Reed", "Yuki Tanaka", "Alex Rivera", "Emma Brooks", "James Park"];
  const readTimes = [3, 4, 5, 6, 7, 8, 10, 12, 15];

  const blogs = [];
  for (let i = 0; i < 500; i++) {
    const titleBase = titles[i % titles.length];
    const suffix = i >= titles.length ? ` — Part ${Math.floor(i / titles.length) + 1}` : "";
    blogs.push({
      id: i + 1,
      title: titleBase + suffix,
      excerpt: `Discover essential tips and expert advice on ${titleBase.toLowerCase()}. This comprehensive guide covers everything you need to know for a thriving aquarium.`,
      category: cats[i % cats.length],
      author: authors[i % authors.length],
      readTime: readTimes[i % readTimes.length],
      date: new Date(2026, 2 - Math.floor(i / 50), 28 - (i % 28)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      image: blogImages[i % blogImages.length],
      featured: i < 3,
    });
  }
  return blogs;
};

const allBlogs = generateBlogs();

const BLOGS_PER_PAGE = 9;

const BlogsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(BLOGS_PER_PAGE);
  
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  const filtered = allBlogs.filter((b) => {
    const matchesCat = activeCategory === "All" || b.category === activeCategory;
    const matchesSearch = !searchQuery || b.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const featured = allBlogs.filter((b) => b.featured);

  return (
    <section id="blog" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 water-caustics opacity-20 pointer-events-none" />
      <div className="orb orb-primary w-[500px] h-[400px] top-[5%] left-[-10%] animate-float-slow" />
      <div className="orb orb-accent w-[400px] h-[300px] bottom-[15%] right-[-8%] animate-float-delayed" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
            Knowledge Hub
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-5">
            The Aquarist's{" "}
            <span className="text-gradient-primary">Library</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            500+ expert guides, species profiles, and deep-dives for every level of fishkeeper.
          </p>
        </motion.div>

        {/* Featured blogs */}
        <div className="grid lg:grid-cols-3 gap-5 mb-16 max-w-6xl mx-auto">
          {featured.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`group glass-card card-hover-glow overflow-hidden cursor-pointer ${
                i === 0 ? "lg:col-span-2 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "h-64 lg:h-full" : "h-44"}`}>
                <motion.img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold mb-3 backdrop-blur-sm">
                    {blog.category}
                  </span>
                  <h3 className={`font-display font-bold mb-2 group-hover:text-primary transition-colors ${i === 0 ? "text-2xl" : "text-base"}`}>
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><User size={10} />{blog.author}</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{blog.readTime} min</span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Table of Contents toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto mb-8"
        >
          <button
            onClick={() => setShowTableOfContents(!showTableOfContents)}
            className="group flex items-center gap-3 glass-card px-6 py-4 w-full text-left hover:border-primary/30 transition-all"
          >
            <ChevronRight size={16} className={`text-primary transition-transform ${showTableOfContents ? "rotate-90" : ""}`} />
            <span className="font-display font-semibold">Table of Contents</span>
            <span className="text-xs text-muted-foreground ml-auto">{allBlogs.length} articles</span>
          </button>
          {showTableOfContents && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="glass-card mt-1 p-6 max-h-80 overflow-y-auto"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5">
                {categories.slice(1).map((cat) => (
                  <div key={cat}>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mt-3 mb-2">{cat}</h4>
                    {allBlogs
                      .filter((b) => b.category === cat)
                      .slice(0, 6)
                      .map((b) => (
                        <p key={b.id} className="text-xs text-muted-foreground py-0.5 hover:text-foreground cursor-pointer transition-colors truncate">
                          {b.title}
                        </p>
                      ))}
                    <p className="text-[10px] text-primary/60 mt-1">+ {allBlogs.filter((b) => b.category === cat).length - 6} more</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Search & Filter bar */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search 500+ articles..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(BLOGS_PER_PAGE); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-secondary/40 border border-border/40 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:border-primary/40 transition-colors backdrop-blur-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setVisibleCount(BLOGS_PER_PAGE); }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-glow-sm)]"
                      : "bg-secondary/40 text-muted-foreground hover:text-foreground hover:bg-secondary/60 border border-border/30"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto mb-8">
          {visible.map((blog, i) => (
            <motion.article
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ delay: (i % 3) * 0.05 }}
              className="group glass-card card-hover-glow overflow-hidden cursor-pointer"
            >
              <div className="relative h-40 overflow-hidden">
                <motion.img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card/80 backdrop-blur-sm text-[10px] font-semibold text-primary border border-primary/10">
                  {blog.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">{blog.excerpt}</p>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><User size={9} />{blog.author}</span>
                    <span className="flex items-center gap-1"><Clock size={9} />{blog.readTime}m</span>
                  </div>
                  <span>{blog.date}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Load more */}
        {visibleCount < filtered.length && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-24"
          >
            <button
              onClick={() => setVisibleCount((c) => c + BLOGS_PER_PAGE)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-border/50 text-foreground font-semibold text-sm hover:bg-secondary/50 hover:border-primary/20 transition-all backdrop-blur-sm"
            >
              Load More Articles
              <ChevronDown size={14} />
            </button>
            <p className="text-xs text-muted-foreground mt-3">
              Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} articles
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
};

export default BlogsSection;
