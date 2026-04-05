import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className, label, error, ...props
}, ref) => {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="text-sm font-medium text-white/80">{label}</label>}
      <input
        ref={ref}
        className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10 focus:border-primary'} rounded-xl px-4 py-3 text-white placeholder-white/40 outline-none transition-colors backdrop-blur-sm ${className || ''}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 ml-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
