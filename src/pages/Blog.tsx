import Navbar from "@/components/Navbar";
import BlogsSection from "@/components/BlogsSection";
import FooterSection from "@/components/FooterSection";

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <BlogsSection />
      </div>
      <FooterSection />
    </div>
  );
};

export default Blog;
