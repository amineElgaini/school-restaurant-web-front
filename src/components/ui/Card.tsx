import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div className={`
      rounded-2xl bg-white border border-slate-200/60 shadow-sm overflow-hidden
      ${hover ? "hover:shadow-md hover:border-slate-300/80 transition-all duration-300" : ""}
      ${className}
    `}>
      {children}
    </div>
  );
}