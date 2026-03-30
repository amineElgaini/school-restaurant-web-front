import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-xl bg-white p-4 shadow ${className}`}>
      {children}
    </div>
  );
}