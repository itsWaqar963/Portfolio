import { useState, useEffect } from "react";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";

interface NavLinkProps {
  href: string;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const NavLink = ({ href, title, isActive, onClick }: NavLinkProps) => (
  <Link href={href}>
    <a
      className={`py-1 px-2 border-b-2 ${
        isActive
          ? "border-primary"
          : "border-transparent hover:border-primary/50"
      } transition-all`}
      onClick={onClick}
    >
      {title}
    </a>
  </Link>
);

const Header = () => {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section);
    });

    return () => {
      document.querySelectorAll("section[id]").forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
      closeMobileMenu();
    }
  };

  const navLinks = [
    { href: "/#home", title: "Home", section: "home" },
    { href: "/#about", title: "About", section: "about" },
    { href: "/#skills", title: "Skills", section: "skills" },
    { href: "/#projects", title: "Projects", section: "projects" },
    { href: "/#blog", title: "Blog", section: "blog" },
    { href: "/#testimonials", title: "Testimonials", section: "testimonials" },
    { href: "/#contact", title: "Contact", section: "contact" },
  ];

  return (
    <header
      className={`fixed w-full bg-background/80 backdrop-blur-md z-50 transition-all duration-300 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <a
            href="#home"
            className="font-heading text-xl font-bold"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("home");
            }}
          >
            <span className="gradient-text">waqar.dev</span>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <i className="fas fa-bars text-xl"></i>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <a
              key={link.section}
              href={link.href}
              className={`py-1 px-2 border-b-2 ${
                activeSection === link.section
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.section);
              }}
            >
              {link.title}
            </a>
          ))}

          <button
            className="ml-4 p-2 rounded-full bg-card text-foreground hover:glow-purple transition-all"
            onClick={toggleTheme}
          >
            <i className={`fas ${theme === "dark" ? "fa-moon" : "fa-sun"}`}></i>
          </button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden absolute w-full bg-card/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col space-y-3 p-4">
          {navLinks.map((link) => (
            <a
              key={link.section}
              href={link.href}
              className={`py-2 px-3 rounded ${
                activeSection === link.section
                  ? "bg-primary/10"
                  : "hover:bg-primary/10"
              } transition-all`}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.section);
              }}
            >
              {link.title}
            </a>
          ))}

          <div className="flex justify-between pt-2 border-t border-muted-foreground/20">
            <span className="text-muted-foreground text-sm">Change theme</span>
            <button
              className="p-2 rounded-full bg-background text-foreground hover:glow-purple transition-all"
              onClick={toggleTheme}
            >
              <i
                className={`fas ${theme === "dark" ? "fa-moon" : "fa-sun"}`}
              ></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
