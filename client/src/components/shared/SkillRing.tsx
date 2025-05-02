import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface SkillRingProps {
  percentage: number;
  icon: string;
}

const SkillRing = ({ percentage, icon }: SkillRingProps) => {
  const [dashoffset, setDashoffset] = useState(314); // Full circle circumference (2 * PI * r = 2 * 3.14 * 50)
  
  // Calculate the dash offset based on percentage
  // 314 is the full circumference of the circle (2 * PI * 50)
  const calculatedOffset = 314 - (314 * percentage) / 100;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDashoffset(calculatedOffset);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [calculatedOffset]);
  
  return (
    <div className="mx-auto w-32 h-32 relative mb-4">
      <svg width="128" height="128" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
        <motion.circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          stroke="hsl(var(--primary))" 
          strokeWidth="8" 
          strokeDasharray="314"
          strokeDashoffset={dashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: 314 }}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <i className={`${icon} text-3xl text-primary mb-1`}></i>
        <span className="font-bold text-xl">{percentage}%</span>
      </div>
    </div>
  );
};

export default SkillRing;
