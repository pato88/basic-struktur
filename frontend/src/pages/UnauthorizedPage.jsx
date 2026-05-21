import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

/**
 * Halaman Peringatan Akses Ditolak (HTTP 403)
 */
const UnauthorizedPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full mb-6">
        <ShieldAlert className="w-16 h-16" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Akses Ditolak</h1>
      <p className="text-slate-400 mt-3 max-w-md text-sm leading-relaxed">
        Maaf, Anda tidak memiliki izin atau wewenang yang diperlukan untuk mengakses halaman ini. Silakan hubungi administrator Anda.
      </p>
      <Link to="/dashboard" className="btn-primary mt-8 inline-block">
        Kembali ke Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
