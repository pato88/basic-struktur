import React, { useState, useContext } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, Users, LogOut, Menu, User, Shield } from 'lucide-react';

/**
 * Layout utama Dashboard Aplikasi dengan Sidebar & Navbar responsif
 */
const DashboardLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  // Menu navigasi dashboard
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['SUPERADMIN', 'ADMIN', 'KASIR', 'USER'],
    },
    {
      name: 'Kelola Pengguna',
      path: '/dashboard/users',
      icon: Users,
      roles: ['SUPERADMIN', 'ADMIN'], // Hanya role admin yang bisa melihat
    },
  ];

  // Saring menu berdasarkan role user saat ini
  const filteredMenu = menuItems.filter(
    (item) => item.roles.includes(user?.role) || user?.role === 'SUPERADMIN'
  );

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 relative">
      
      {/* Sidebar Navigation */}
      <aside
        className={`glass-sidebar fixed md:sticky top-0 bottom-0 left-0 z-20 flex flex-col h-screen transform ${
          isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
        } transition-all duration-300 ease-in-out`}
      >
        {/* Sidebar Header (Logo) */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-900/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-indigo-600 rounded-lg flex-shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 whitespace-nowrap">
                STRUCTURE
              </span>
            )}
          </div>
        </div>

        {/* Sidebar Body (List Menu) */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer (Tombol Logout) */}
        <div className="p-4 border-t border-slate-900/80">
          <button
            onClick={logout}
            className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && <span className="text-sm font-medium">Keluar</span>}
          </button>
        </div>
      </aside>

      {/* Backdrop Sidebar untuk Mobile */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
        ></div>
      )}

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar */}
        <header className="glass-navbar sticky top-0 z-10 flex items-center justify-between h-16 px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4">
            {/* Info Status Pengguna */}
            <div className="flex flex-col items-end">
              <span className="text-sm font-semibold">{user?.username}</span>
              <span className="text-[10px] text-indigo-400 font-medium px-2 py-0.5 bg-indigo-500/10 rounded-full border border-indigo-500/20 mt-0.5">
                {user?.role}
              </span>
            </div>
            {/* Avatar Profil */}
            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
              <User className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
        </header>

        {/* Konten Halaman Dinamis */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
