import React from 'react';
import { cn } from '@/lib/utils';

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function AuthButton({ 
  className, 
  isLoading, 
  variant = 'primary', 
  size = 'md',
  children, 
  disabled,
  ...props 
}: AuthButtonProps) {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';
  
  const variants = {
    primary: 'bg-brand-yellow text-brand-dark hover:bg-yellow-400 shadow-lg hover:shadow-xl hover:shadow-brand-yellow/25',
    secondary: 'bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm',
    ghost: 'text-brand-yellow hover:bg-brand-yellow/10'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shimmer effect for primary button */}
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      )}
      
      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Content */}
      <span className={cn('relative flex items-center gap-2', isLoading && 'opacity-0')}>
        {children}
      </span>
    </button>
  );
}
