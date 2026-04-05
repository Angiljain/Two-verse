import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, variant = 'primary', isLoading, children, ...props 
}, ref) => {
  const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full px-6 py-3 overflow-hidden disabled:opacity-50";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40",
    secondary: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md",
    outline: "border-2 border-primary/50 text-white hover:border-primary",
    ghost: "text-white/70 hover:text-white hover:bg-white/5",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      ref={ref}
      className={`${baseStyles} ${variants[variant]} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : children}
    </motion.button>
  );
});

Button.displayName = 'Button';
