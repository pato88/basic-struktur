import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * Komponen Pelindung Route (Auth & RBAC Guard)
 * @param {string[]} allowedRoles - Daftar role yang diperbolehkan mengakses (opsional)
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useContext(AuthContext);

  // Tampilkan loader saat session sedang dicek
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="text-sm text-slate-400 font-medium">Memuat data...</span>
        </div>
      </div>
    );
  }

  // Jika user belum login, redirect ke halaman login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika role dibatasi, dan role user saat ini tidak diperbolehkan (kecuali SUPERADMIN yang bypass)
  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'SUPERADMIN') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children jika ada, jika tidak, render router Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
