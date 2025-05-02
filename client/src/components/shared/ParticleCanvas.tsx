import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/use-theme";

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  originalX: number; // Original position to return to
  originalY: number; // Original position to return to
};

type MousePosition = {
  x: number | null;
  y: number | null;
};

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: null, y: null });
  const mouseRadius = 150; // Mouse influence radius
  const prevMousePositionsRef = useRef<{x: number, y: number}[]>([]);
  const maxTrailLength = 5; // Maximum number of positions to remember for trail effect
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: Particle[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(); // Re-initialize particles when canvas is resized
    };
    
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 150);
      
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        particles.push({
          x: x,
          y: y,
          originalX: x, // Store original position
          originalY: y, // Store original position
          size: Math.random() * 1.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: Math.random() > 0.5 
            ? theme === "dark" ? "rgba(110, 86, 207, 0.5)" : "rgba(110, 86, 207, 0.3)"
            : theme === "dark" ? "rgba(66, 165, 245, 0.5)" : "rgba(66, 165, 245, 0.3)"
        });
      }
    };
    
    const handleMouseMove = (event: MouseEvent) => {
      // Get mouse position relative to canvas
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Update mouse position
      setMousePosition({ x, y });
      
      // Add current position to trail history
      if (x && y) {
        const newPositions = [...prevMousePositionsRef.current, {x, y}];
        // Keep only the most recent positions (limit to maxTrailLength)
        if (newPositions.length > maxTrailLength) {
          newPositions.shift();
        }
        prevMousePositionsRef.current = newPositions;
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between particles
      ctx.strokeStyle = theme === "dark" 
        ? "rgba(110, 86, 207, 0.1)" 
        : "rgba(110, 86, 207, 0.05)";
      ctx.lineWidth = 0.3;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw cursor trail if mouse position exists
      if (mousePosition.x !== null && mousePosition.y !== null) {
        // Draw outer glow around cursor
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, mouseRadius / 2
        );
        
        // Set gradient colors based on theme
        if (theme === "dark") {
          gradient.addColorStop(0, "rgba(110, 86, 207, 0.15)");
          gradient.addColorStop(1, "rgba(110, 86, 207, 0)");
        } else {
          gradient.addColorStop(0, "rgba(66, 165, 245, 0.1)");
          gradient.addColorStop(1, "rgba(66, 165, 245, 0)");
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, mouseRadius / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw trail using previous mouse positions
        const trail = prevMousePositionsRef.current;
        if (trail.length > 1) {
          ctx.beginPath();
          ctx.moveTo(trail[0].x, trail[0].y);
          
          // Create smooth curve through previous positions
          for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
          }
          
          // Set trail style based on theme
          ctx.strokeStyle = theme === "dark" 
            ? "rgba(110, 86, 207, 0.3)" 
            : "rgba(66, 165, 245, 0.2)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
      
      // Update and draw particles
      particles.forEach(particle => {
        // Apply mouse interaction
        if (mousePosition.x !== null && mousePosition.y !== null) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouseRadius) {
            // Calculate repulsion force (stronger when closer)
            const force = (mouseRadius - distance) / mouseRadius;
            const angle = Math.atan2(dy, dx);
            
            // Move particles away from cursor with gentle force
            particle.x -= Math.cos(angle) * force * 2;
            particle.y -= Math.sin(angle) * force * 2;
          } else {
            // Gradually return particles to their original paths when not influenced by mouse
            particle.x += (particle.originalX - particle.x) * 0.01 + particle.speedX;
            particle.y += (particle.originalY - particle.y) * 0.01 + particle.speedY;
            
            // Keep updating the original position for smooth floating effect
            particle.originalX += particle.speedX;
            particle.originalY += particle.speedY;
          }
        } else {
          // Normal movement when mouse is not over the canvas
          particle.x += particle.speedX;
          particle.y += particle.speedY;
          particle.originalX += particle.speedX;
          particle.originalY += particle.speedY;
        }
        
        // Wrap particles and their original positions around canvas edges
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.originalX = 0;
        } else if (particle.x < 0) {
          particle.x = canvas.width;
          particle.originalX = canvas.width;
        }
        
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.originalY = 0;
        } else if (particle.y < 0) {
          particle.y = canvas.height;
          particle.originalY = canvas.height;
        }
        
        // Draw particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    // Initialize and start animation
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", handleMouseMove);
    resizeCanvas();
    drawParticles();
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, mousePosition]);
  
  return <canvas ref={canvasRef} className="canvas-bg" />;
};

export default ParticleCanvas;
