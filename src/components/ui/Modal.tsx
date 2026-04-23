import type { ReactNode } from "react";
import Card from "./Card";

type ModalProps = {
  isOpen: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
};

export default function Modal({ isOpen, title, children, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Card className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="group rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {children}
        </div>
      </Card>
    </div>
  );
}