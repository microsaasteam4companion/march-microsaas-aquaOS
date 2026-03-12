import { useParams, Navigate } from "react-router-dom";
import { allBlogs } from "@/data/blogs";
import Navbar from "@/components/Navbar";
import BlogLayout from "@/components/BlogLayout";
import FooterSection from "@/components/FooterSection";
import { useEffect } from "react";

const BlogPost = () => {
  const { slug } = useParams();
  const blog = allBlogs.find((b) => b.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!blog) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <BlogLayout blog={blog} />
      <FooterSection />
    </div>
  );
};

export default BlogPost;
