import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  className?: string;
};

export default function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors duration-200";
  
  const variants = {
    success: "bg-emerald-100 text-emerald-700 border border-emerald-200/50",
    warning: "bg-amber-100 text-amber-700 border border-amber-200/50",
    danger: "bg-red-100 text-red-700 border border-red-200/50",
    info: "bg-blue-100 text-blue-700 border border-blue-200/50",
    neutral: "bg-slate-100 text-slate-700 border border-slate-200/50",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
