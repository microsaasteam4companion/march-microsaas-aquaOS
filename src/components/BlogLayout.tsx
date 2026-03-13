import { motion } from "framer-motion";
import { ChevronRight, Clock, Share2, Facebook, Twitter, Link as LinkIcon, MessageSquare } from "lucide-react";
import { BlogPost, allBlogs } from "@/data/blogs";
import { Link } from "react-router-dom";

interface BlogLayoutProps {
  blog: BlogPost;
}

const BlogLayout = ({ blog }: BlogLayoutProps) => {
  const relatedBlogs = allBlogs
    .filter((b) => b.category === blog.category && b.id !== blog.id)
    .slice(0, 4);

  // Generate AEO/GEO Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": blog.title,
        "description": blog.excerpt,
        "image": blog.image,
        "datePublished": blog.date ? new Date(blog.date).toISOString() : new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": blog.author || "AquaOS Editorial Team"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Entrext Labs",
          "logo": {
            "@type": "ImageObject",
            "url": "https://aquaos.entrext.com/favicon.png" // Updated to use the correct favicon
          }
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": blog.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="absolute inset-0 water-caustics opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link to="/" className="shrink-0 hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={12} className="shrink-0" />
          <Link to="/blog" className="shrink-0 hover:text-primary transition-colors">Blog</Link>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-foreground font-medium truncate">{blog.title}</span>
        </nav>

        {/* Hero Section */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider border border-primary/20">
              {blog.category}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1]">
            {blog.title}
          </h1>
          <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-border/40">
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{blog.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2 text-xs">
                <Clock size={14} className="text-primary" />
                {blog.readTime} min read
              </span>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg bg-secondary/40 hover:bg-primary/10 hover:text-primary transition-all border border-border/40">
                  <Share2 size={16} />
                </button>
                <button className="p-2 rounded-lg bg-secondary/40 hover:bg-primary/10 hover:text-primary transition-all border border-border/40">
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          {/* Main Content */}
          <article className="space-y-12">
            {/* Summary / TL;DR */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 sm:p-8 bg-primary/5 border-primary/20 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="p-2 rounded-lg bg-primary/20 text-primary">
                    <LinkIcon size={18} />
                  </span>
                  <h2 className="text-xl font-bold uppercase tracking-tight">SUMMARY (TL;DR)</h2>
                </div>
                <ul className="space-y-4">
                  {blog.summary.map((point, i) => (
                    <li key={i} className="flex gap-4 text-sm text-foreground/80 leading-relaxed">
                      <span className="text-primary font-bold mt-0.5 whitespace-nowrap">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Featured Image */}
            <div className="relative aspect-video rounded-[32px] overflow-hidden mb-12 group border border-border/40 shadow-2xl">
              <img 
                src={blog.image} 
                alt={blog.title} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&q=80&w=1200";
                }}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
            </div>

            {/* Article Sections */}
            <div className="prose prose-invert prose-blue max-w-none">
              {blog.sections.map((section, i) => (
                <section key={i} id={`section-${i}`} className="mb-12 scroll-mt-32">
                  <h2 className="font-display text-3xl font-bold mb-6 text-foreground border-l-4 border-primary pl-6 py-1">
                    {section.title}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    {section.content}
                  </p>
                </section>
              ))}
            </div>

            {/* FAQ Section */}
            <div className="glass-card p-6 sm:p-10 border-border/30 bg-secondary/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-accent" />
               <h2 className="font-display text-3xl font-bold mb-10 flex items-center gap-4">
                 <span className="text-gradient-primary">Frequently Asked</span> Questions
               </h2>
               <div className="space-y-8">
                 {blog.faqs.map((faq, i) => (
                   <div key={i} className="group">
                     <h3 className="text-lg font-bold mb-3 text-foreground group-hover:text-primary transition-colors flex gap-4">
                       <span className="text-muted-foreground">Q:</span> {faq.question}
                     </h3>
                     <p className="text-muted-foreground leading-relaxed pl-9 border-l border-border/40 ml-2.5">
                       {faq.answer}
                     </p>
                   </div>
                 ))}
               </div>
            </div>

            {/* Keywords / SEO Tags */}
            <div className="pt-8 border-t border-border/40">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Expert Keywords & Related Topics</h3>
              <div className="flex flex-wrap gap-2">
                {blog.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground text-[10px] font-medium border border-border/40 hover:border-primary/30 hover:text-primary transition-all cursor-default">
                    #{kw.replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="p-6 sm:p-10 rounded-[24px] sm:rounded-[32px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent border border-primary/20 shadow-inner">
              <h2 className="font-display text-3xl font-bold mb-6">Final Thoughts</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Consistency and monitoring are your greatest allies in the aquarium hobby. By following the steps outlined in this guide, you're setting yourself—and your livestock—up for long-term health and success.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="px-8 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:shadow-[var(--shadow-glow-md)] transition-all flex items-center gap-2">
                  Try AquaOS Free
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8 hidden lg:block">
            {/* Table of Contents */}
            <div className="sticky top-28 p-6 glass-card border-border/30 bg-card/60 backdrop-blur-md">
              <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
                <LinkIcon size={14} />
                On This Page
              </h3>
              <nav className="space-y-2">
                {blog.sections.map((section, i) => (
                  <a 
                    key={i} 
                    href={`#section-${i}`}
                    className="block text-sm text-muted-foreground hover:text-primary hover:pl-2 transition-all duration-300 py-1 border-l-2 border-transparent hover:border-primary"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="mt-10 pt-8 border-t border-border/40">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/10 text-center">
                  <p className="text-xs font-semibold text-foreground mb-3">Master Your Tank with AquaOS</p>
                  <button className="w-full py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:scale-105 transition-transform">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Connected Hub (Related Blogs) */}
        <section className="mt-32 pt-20 border-t border-border/40">
          <div className="flex items-center justify-between mb-12">
             <h2 className="font-display text-3xl sm:text-4xl font-bold">
               Connected <span className="text-gradient-primary">Article Hub</span>
             </h2>
             <Link to="/blog" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 group">
               View All
               <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedBlogs.map((b) => (
              <Link to={`/blog/${b.slug}`} key={b.id} className="group block">
                <div className="glass-card card-hover-glow h-full flex flex-col overflow-hidden">
                  <div className="h-40 overflow-hidden relative">
                    <img src={b.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={b.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-primary uppercase mb-2 tracking-widest">{b.category}</span>
                    <h3 className="text-sm font-bold mb-4 line-clamp-2 group-hover:text-primary transition-colors">{b.title}</h3>
                    <div className="mt-auto flex items-center justify-between text-muted-foreground text-[10px]">
                      <span className="flex items-center gap-1"><Clock size={10} /> {b.readTime}m</span>
                      <span>{b.date}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogLayout;
