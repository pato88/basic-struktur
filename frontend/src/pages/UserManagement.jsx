import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Users, Search, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

/**
 * Halaman Kelola Pengguna (CRUD)
 */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 5, total: 0, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  
  // State Form Input
  const [form, setForm] = useState({ username: '', email: '', password: '', roleId: 4, isActive: true });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Fetch daftar user dari backend
  const fetchUsers = useCallback(async (pageNumber = 1, searchQuery = '') => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/users`, {
        params: { page: pageNumber, limit: 5, search: searchQuery },
      });
      // Axios interceptor mengembalikan response.data langsung
      setUsers(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 5, total: 0, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Gagal mengambil data user.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Memantau perubahan search dengan debouncing sederhana
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers(1, search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, fetchUsers]);

  // Handler Buka Modal (Mode Tambah)
  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setForm({ username: '', email: '', password: '', roleId: 4, isActive: true });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handler Buka Modal (Mode Edit)
  const handleOpenEditModal = (user) => {
    setModalMode('edit');
    setSelectedUser(user);
    setForm({
      username: user.username,
      email: user.email,
      password: '', // Kosongkan password saat edit, diisi jika ingin diganti saja
      roleId: user.roleId,
      isActive: user.isActive,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  // Handler Submit Form
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      if (modalMode === 'create') {
        await api.post('/users', form);
      } else {
        // Pada mode edit, password opsional (hanya dikirim jika diisi)
        const payload = { ...form };
        if (!payload.password) delete payload.password;
        
        await api.put(`/users/${selectedUser.id}`, payload);
      }
      
      setIsModalOpen(false);
      fetchUsers(pagination.page, search);
    } catch (err) {
      // Menangkap error array validasi dari Zod jika ada
      if (err.errors && Array.isArray(err.errors)) {
        setFormError(err.errors[0].message);
      } else {
        setFormError(err.message || 'Gagal menyimpan data user.');
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  // Handler Hapus User
  const handleDeleteUser = async (user) => {
    if (user.role?.name === 'SUPERADMIN') {
      alert('Role SUPERADMIN tidak dapat dihapus!');
      return;
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus user "${user.username}"?`)) {
      try {
        await api.delete(`/users/${user.id}`);
        fetchUsers(pagination.page, search);
      } catch (err) {
        alert(err.message || 'Gagal menghapus user.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
            <p className="text-xs text-slate-400 mt-1">Buat, ubah, dan hapus user aplikasi di sini</p>
          </div>
        </div>
        <button onClick={handleOpenCreateModal} className="btn-primary flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Tambah Pengguna
        </button>
      </div>

      {/* Bar Pencarian */}
      <div className="glass-card p-4 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari user berdasarkan username atau email..."
          className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:outline-none text-sm"
        />
      </div>

      {/* Banner Error API */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabel Utama */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Tanggal Dibuat</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                // Skeleton Loading baris tabel
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td><div className="h-4 bg-slate-800 rounded-md w-28 animate-pulse"></div></td>
                    <td><div className="h-4 bg-slate-800 rounded-md w-36 animate-pulse"></div></td>
                    <td><div className="h-4 bg-slate-800 rounded-md w-16 animate-pulse"></div></td>
                    <td><div className="h-4 bg-slate-800 rounded-md w-14 animate-pulse"></div></td>
                    <td><div className="h-4 bg-slate-800 rounded-md w-24 animate-pulse"></div></td>
                    <td><div className="h-8 bg-slate-800 rounded-md w-20 mx-auto animate-pulse"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-slate-500">
                    Tidak ada data user ditemukan.
                  </td>
                </tr>
              ) : (
                users.map((userItem) => (
                  <tr key={userItem.id}>
                    <td className="font-semibold text-slate-200">{userItem.username}</td>
                    <td className="text-slate-400">{userItem.email}</td>
                    <td>
                      <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/10">
                        {userItem.role?.name}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                          userItem.isActive
                            ? 'text-green-400 bg-green-500/10 border-green-500/10'
                            : 'text-red-400 bg-red-500/10 border-red-500/10'
                        }`}
                      >
                        {userItem.isActive ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="text-slate-500 text-xs">
                      {new Date(userItem.createdAt).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(userItem)}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(userItem)}
                          disabled={userItem.role?.name === 'SUPERADMIN'}
                          className={`p-2 rounded-lg border transition-colors ${
                            userItem.role?.name === 'SUPERADMIN'
                              ? 'bg-slate-900 text-slate-600 border-slate-950 cursor-not-allowed'
                              : 'bg-red-950/20 hover:bg-red-900/20 text-red-400 border-red-900/30'
                          }`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Kontrol Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-900/80">
            <span className="text-xs text-slate-400">
              Total {pagination.total} user
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchUsers(pagination.page - 1, search)}
                disabled={pagination.page === 1}
                className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
              >
                Sebelumnya
              </button>
              <span className="text-xs text-slate-400 font-semibold px-3">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => fetchUsers(pagination.page + 1, search)}
                disabled={pagination.page === pagination.totalPages}
                className="btn-secondary px-3 py-1.5 text-xs disabled:opacity-50"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Popup Form (Create & Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Background overlay */}
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>

          {/* Modal Content */}
          <div className="w-full max-w-md glass-card p-6 shadow-2xl relative z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <h3 className="font-bold text-lg text-slate-100">
                {modalMode === 'create' ? 'Tambah Pengguna Baru' : 'Ubah Data Pengguna'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error Form */}
            {formError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Masukkan username"
                  className="w-full glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Masukkan email"
                  className="w-full glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password {modalMode === 'edit' && <span className="text-slate-500 font-normal">(Isi jika ingin diubah)</span>}
                </label>
                <input
                  type="password"
                  required={modalMode === 'create'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Masukkan password"
                  className="w-full glass-input text-sm"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Hak Akses (Role)
                </label>
                <select
                  value={form.roleId}
                  onChange={(e) => setForm({ ...form, roleId: parseInt(e.target.value) })}
                  className="w-full glass-input text-sm bg-slate-900 border-slate-800"
                >
                  <option value={1} className="bg-slate-900">SUPERADMIN</option>
                  <option value={2} className="bg-slate-900">ADMIN</option>
                  <option value={3} className="bg-slate-900">KASIR</option>
                  <option value={4} className="bg-slate-900">USER</option>
                </select>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 accent-indigo-600 focus:ring-0"
                />
                <label htmlFor="isActive" className="text-sm text-slate-300 font-medium cursor-pointer">
                  Status Aktif (Bisa Login)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary py-2 text-xs">
                  Batal
                </button>
                <button type="submit" disabled={formSubmitting} className="btn-primary py-2 text-xs">
                  {formSubmitting ? 'Menyimpan...' : 'Simpan User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
