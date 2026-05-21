import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Users, Activity } from 'lucide-react';

/**
 * Halaman utama (Home) Dashboard
 */
const DashboardHome = () => {
  const { user } = useContext(AuthContext);

  // Mock data statistik
  const stats = [
    {
      name: 'Status Database',
      value: 'Terkoneksi',
      icon: ShieldCheck,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      name: 'Role Anda',
      value: user?.role || 'Guest',
      icon: Users,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      name: 'Aktivitas Server',
      value: 'Normal (API Online)',
      icon: Activity,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Selamat Datang */}
      <div className="glass-card p-8 bg-gradient-to-r from-slate-900/60 to-indigo-950/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-3xl font-bold tracking-tight">
          Halo,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            {user?.username}
          </span>
          !
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed">
          Selamat datang di panel administrasi utama. Kerangka dasar aplikasi Anda telah sukses dikonfigurasi dan siap digunakan. Anda tinggal melanjutkan pembuatan tabel & fitur bisnis lainnya sesuai projek Anda.
        </p>
      </div>

      {/* Grid Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.name}</p>
                <p className="text-xl font-bold text-slate-100 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3.5 ${stat.bg} ${stat.color} rounded-2xl border ${stat.borderColor} flex-shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;
