import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading, 
  icon: Icon,
  className = '', 
  disabled,
  ...props 
}, ref) => {
  const baseStyle = "inline-flex items-center justify-center font-medium transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || disabled}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className="mr-2 h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
