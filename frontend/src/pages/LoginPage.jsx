import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

/**
 * Halaman Login Pengguna
 */
const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(emailOrUsername, password);
      // Pindahkan user ke dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header Halaman */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-100">Selamat Datang</h2>
        <p className="text-sm text-slate-400 mt-2">Masuk untuk mengelola sistem Anda</p>
      </div>

      {/* Banner Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center gap-3 text-sm">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Login */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Username / Email
          </label>
          <input
            type="text"
            required
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full glass-input"
            placeholder="Masukkan username atau email"
          />
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Kata Sandi
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full glass-input"
            placeholder="Masukkan password"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-2"
        >
          {submitting ? 'Memproses...' : 'Masuk ke Aplikasi'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
