import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar />

      <main className="mx-auto max-w-7xl p-6 lg:p-10">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet />
        </div>
      </main>
      
      {/* Footer / Bottom spacing */}
      <footer className="py-10 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} School Restaurant Management System
      </footer>
    </div>
  );
}