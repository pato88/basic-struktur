import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * Layout khusus untuk halaman Autentikasi (Login / Register)
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 p-4 relative overflow-hidden">
      
      {/* Background Bulatan Neon Bercahaya (Glow Effect) */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>

      {/* Card Glassmorphic Utama */}
      <div className="w-full max-w-md glass-card p-8 shadow-2xl relative overflow-hidden">
        {/* Garis Gradasi Premium di Bagian Atas Card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        
        {/* Tempat Halaman Form Login / Register di-render */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
  
