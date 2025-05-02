import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import SkillsSection from "@/components/home/SkillsSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import BlogSection from "@/components/home/BlogSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";
import ParticleCanvas from "@/components/shared/ParticleCanvas";
import AIAssistant from "@/components/shared/AIAssistant";
import { Helmet } from "react-helmet";

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Waqar Ahmed | Smart Backend Developer</title>
        <meta name="description" content="Portfolio of Waqar Ahmed, a backend developer with expertise in Java, Spring Boot & AI with Odoo." />
      </Helmet>
      
      <ParticleCanvas />
      <Header />
      
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      
      <Footer />
      <AIAssistant />
    </>
  );
};

export default Home;
