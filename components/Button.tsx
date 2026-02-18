import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  wiggle?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  wiggle = false,
  disabled,
  ...props 
}) => {
  
  // Base style: Thick borders, hard shadow (pop), rounded-xl
  const baseStyle = "font-display font-black rounded-xl border-4 border-black transition-all duration-100 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-pop-active";
  
  // Variants with bright colors
  const variants = {
    primary: "bg-[#8b5cf6] text-white shadow-pop hover:bg-[#7c3aed]",
    secondary: "bg-[#f472b6] text-white shadow-pop hover:bg-[#ec4899]",
    accent: "bg-[#fbbf24] text-black shadow-pop hover:bg-[#f59e0b]",
    success: "bg-[#a3e635] text-black shadow-pop hover:bg-[#84cc16]",
    danger: "bg-[#ef4444] text-white shadow-pop hover:bg-[#dc2626]",
    ghost: "bg-white text-black shadow-pop hover:bg-slate-50 border-black",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-lg",
    lg: "px-8 py-4 text-xl",
    xl: "px-10 py-6 text-2xl tracking-wide",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05, rotate: disabled ? 0 : -2 }}
      whileTap={{ scale: 0.95, rotate: 0 }}
      animate={wiggle ? { rotate: [0, -3, 3, -3, 3, 0], transition: { repeat: Infinity, duration: 2 } } : {}}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
          Vent...
        </>
      ) : children}
    </motion.button>
  );
};