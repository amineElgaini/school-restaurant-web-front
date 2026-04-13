import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        <input
          className={`
            w-full rounded-xl border border-slate-200 bg-white px-4 py-3 
            text-slate-900 placeholder:text-slate-400
            transition-all duration-200 outline-none
            hover:border-slate-300
            focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}
            ${className}
          `}
          {...props}
        />
      </div>

      {error && (
        <p className="text-xs font-medium text-red-600 ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}