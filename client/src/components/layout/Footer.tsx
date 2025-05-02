import { useTheme } from "@/hooks/use-theme";

const Footer = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="py-8 border-t border-muted-foreground/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">
              © 2025 Waqar.dev — Built with intelligence
            </p>
          </div>
          
          <div className="flex items-center space-x-6 mb-4 md:mb-0">
            <a href="https://github.com/itsWaqar963" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="fab fa-github text-xl"></i>
            </a>
            <a href="https://www.linkedin.com/in/waqar963" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="fab fa-linkedin text-xl"></i>
            </a>
            <a href="mailto:waqar.ah963@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">
              <i className="fas fa-envelope text-xl"></i>
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-card text-foreground hover:glow-purple transition-all"
            >
              <i className={`fas ${theme === "dark" ? "fa-moon" : "fa-sun"}`}></i>
            </button>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-full bg-card text-foreground hover:glow-purple transition-all"
            >
              <i className="fas fa-arrow-up"></i>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
