import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'CUSTOMER',
    first_name: '',
    last_name: '',
    password: '',
    vehicle_type: '',
    bank_account: '',
  });
  const [ktmImage, setKtmImage] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.role === 'DRIVER' && !formData.email.endsWith('@students.unnes.ac.id')) {
      setError('Untuk mendaftar sebagai Driver, wajib menggunakan email mahasiswa UNNES (@students.unnes.ac.id)');
      setLoading(false);
      return;
    }

    if (!ktmImage) {
      setError('Foto KTM/KTP wajib diunggah');
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('password', formData.password);
      data.append('role', formData.role);
      data.append('first_name', formData.first_name);
      data.append('last_name', formData.last_name);
      data.append('ktm_image', ktmImage);
      if (formData.role === 'DRIVER') {
        data.append('vehicle_type', formData.vehicle_type);
        data.append('bank_account', formData.bank_account);
      }

      await api.post('auth/register/', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal melakukan pendaftaran. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-sm w-full card card-lg text-center">
          <div className="w-14 h-14 bg-primary-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil</h2>
          <p className="text-sm text-gray-500 mb-6">
            Akun Anda sedang ditinjau oleh Admin. Kamu akan bisa login setelah akun disetujui.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn btn-primary btn-full"
          >
            Kembali ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary-DEFAULT rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-xl font-bold text-gray-900">ANTARIN</span>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Buat akun baru</h2>
          <p className="text-gray-500 text-sm mt-1">Khusus mahasiswa UNNES Semarang</p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-lg mb-5 text-sm" style={{background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA'}}>
            {error}
          </div>
        )}

        <div className="card">
          <form onSubmit={handleRegister} className="space-y-4">

            {/* Role Selection */}
            <div className="form-group">
              <label className="input-label">Daftar sebagai</label>
              <div className="grid grid-cols-2 gap-3">
                {['CUSTOMER', 'DRIVER'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({...formData, role})}
                    className={`py-3 px-4 rounded-lg border text-sm font-semibold transition-colors ${
                      formData.role === role
                        ? 'bg-primary-muted text-primary-DEFAULT border-primary-light'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {role === 'CUSTOMER' ? 'Customer' : 'Driver (Mitra)'}
                  </button>
                ))}
              </div>
              {formData.role === 'DRIVER' && (
                <p className="text-xs text-gray-500 mt-2">
                  Driver wajib menggunakan email @students.unnes.ac.id
                </p>
              )}
            </div>

            <hr className="divider" />

            {/* Email */}
            <div className="form-group">
              <label htmlFor="reg-email" className="input-label">
                {formData.role === 'DRIVER' ? 'Email Student UNNES' : 'Email'}
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="input-field"
                placeholder={formData.role === 'DRIVER' ? "nama@students.unnes.ac.id" : "nama@email.com"}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="reg-password" className="input-label">Password</label>
              <input
                id="reg-password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="input-field"
                placeholder="Minimal 6 karakter"
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {/* Name */}
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="reg-fname" className="input-label">Nama Depan</label>
                <input
                  id="reg-fname"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  className="input-field"
                  placeholder="Budi"
                  autoComplete="given-name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="reg-lname" className="input-label">Nama Belakang</label>
                <input
                  id="reg-lname"
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  className="input-field"
                  placeholder="Santoso"
                  autoComplete="family-name"
                />
              </div>
            </div>

            {/* KTM Upload */}
            <div className="form-group">
              <label className="input-label">Foto KTP / KTM</label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) setKtmImage(e.target.files[0]);
                }}
                className="input-field text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Diperlukan untuk verifikasi identitas. Dokumen aman dan hanya dilihat Admin.
              </p>
            </div>

            {/* Driver-specific fields */}
            {formData.role === 'DRIVER' && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700">Informasi Kendaraan</p>
                <div className="form-group">
                  <label htmlFor="vehicle" className="input-label">Jenis Kendaraan & Plat Nomor</label>
                  <input
                    id="vehicle"
                    type="text"
                    required
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
                    className="input-field"
                    placeholder="Honda Vario 150 · H 1234 AB"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bank" className="input-label">Nomor Rekening / E-Wallet</label>
                  <input
                    id="bank"
                    type="text"
                    required
                    value={formData.bank_account}
                    onChange={(e) => setFormData({...formData, bank_account: e.target.value})}
                    className="input-field"
                    placeholder="GoPay · 0812-xxxx-xxxx · Budi"
                  />
                  <p className="text-xs text-gray-500 mt-1">Digunakan untuk pencairan komisi</p>
                </div>
              </div>
            )}

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
              ) : 'Daftar Sekarang'}
            </button>
          </form>
        </div>

        <div className="mt-5 text-center">
          <p className="text-sm text-gray-500">
            Sudah punya akun?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="font-semibold text-primary-DEFAULT hover:text-primary-dark transition-colors"
            >
              Masuk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
