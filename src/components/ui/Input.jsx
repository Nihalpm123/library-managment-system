import React from 'react';

export const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border ${
          error ? 'border-red-500' : 'border-slate-300 dark:border-slate-700'
        } rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 placeholder-slate-400 dark:placeholder-slate-500 transition-colors ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
