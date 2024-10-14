import BlogSection from "../components/blog_section/BlogsContainer";
import HeroSection from "../components/hero_section/HeroSection";

function HomePage() {
  return (
    <div style={{ paddingTop: "100px" }}>
      <HeroSection />
      <BlogSection />
    </div>
  );
}

export default HomePage;
