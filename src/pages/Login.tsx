import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');

    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      if (err.response?.data?.need_registration) {
        navigate('/register');
      } else {
        setError(err.response?.data?.error || err.response?.data?.detail || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Brand */}
      <div className="hidden md:flex md:w-2/5 bg-primary-DEFAULT flex-col justify-center px-12 py-16">
        <div className="max-w-xs">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-8">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight mb-4">
            ANTARIN
          </h1>
          <p className="text-teal-100 text-base leading-relaxed">
            Platform antar-jemput dan jasa titip khusus mahasiswa UNNES.
            Cepat, aman, dan terpercaya.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-teal-100 text-sm">Driver terverifikasi mahasiswa UNNES</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-teal-100 text-sm">Antar-jemput dan jasa titip dalam satu platform</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-white/20 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              </div>
              <p className="text-teal-100 text-sm">Pembayaran fleksibel: cash atau saldo dompet</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* Mobile brand */}
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-primary-DEFAULT rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold text-gray-900">ANTARIN</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Masuk ke akun</h2>
            <p className="text-gray-500 mt-2 text-sm">Selamat datang kembali</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg mb-5 text-sm" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="form-group">
              <label htmlFor="email" className="input-label">Email</label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="nama@email.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Masukkan password"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full btn-lg mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  <span>Memproses...</span>
                </>
              ) : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-semibold text-primary-DEFAULT hover:text-primary-dark transition-colors"
              >
                Daftar sekarang
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
