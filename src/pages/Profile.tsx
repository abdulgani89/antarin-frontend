import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    vehicle_type: '',
    bank_account: '',
    photo_url: '',
    ktm_image: '',
    profile_image: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('auth/me/');
        setFormData({
          first_name: res.data.first_name || '',
          last_name: res.data.last_name || '',
          email: res.data.email || '',
          role: res.data.role || '',
          vehicle_type: res.data.vehicle_type || '',
          bank_account: res.data.bank_account || '',
          photo_url: res.data.photo_url || '',
          ktm_image: res.data.ktm_image || '',
          profile_image: null,
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('first_name', formData.first_name);
      formDataToSend.append('last_name', formData.last_name);
      if (formData.role === 'DRIVER') {
        formDataToSend.append('vehicle_type', formData.vehicle_type);
        formDataToSend.append('bank_account', formData.bank_account);
      }
      if (formData.profile_image) {
        formDataToSend.append('profile_image', formData.profile_image);
      }
      const res = await api.put('auth/me/', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil. Coba lagi.' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const profileImageUrl = formData.photo_url || (
    user?.profile_image
      ? (user.profile_image.startsWith('http') ? user.profile_image : `http://localhost:8000${user.profile_image}`)
      : null
  );

  const displayName = [formData.first_name, formData.last_name].filter(Boolean).join(' ') || formData.email;
  const initials = (formData.first_name || formData.email || 'U').charAt(0).toUpperCase();

  return (
    <div className="max-w-lg mx-auto space-y-6">

      <h1 className="text-page-title">Profil Saya</h1>

      {/* Profile Card Header */}
      <div className="card flex items-center gap-4">
        <div className="relative">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profil"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 bg-primary-muted rounded-full flex items-center justify-center">
              <span className="text-primary-DEFAULT font-bold text-xl">{initials}</span>
            </div>
          )}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-base">{displayName}</p>
          <p className="text-sm text-gray-500">{formData.email}</p>
          <span className="badge badge-primary mt-1 capitalize">{formData.role?.toLowerCase()}</span>
        </div>
      </div>

      {/* Alert */}
      {message.text && (
        <div className={`px-4 py-3 rounded-lg text-sm flex items-center gap-2 ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'text-red-600 border border-red-200'
        }`} style={message.type === 'error' ? {background: '#FEF2F2'} : {}}>
          {message.type === 'success' && <CheckIcon />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Informasi Dasar</h2>

          <div className="form-group">
            <label className="input-label">Email (tidak dapat diubah)</label>
            <input type="email" disabled value={formData.email} className="input-field" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label htmlFor="first_name" className="input-label">Nama Depan</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Budi"
              />
            </div>
            <div className="form-group">
              <label htmlFor="last_name" className="input-label">Nama Belakang</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="input-field"
                placeholder="Santoso"
              />
            </div>
          </div>
        </div>

        {/* Photo */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Foto Profil</h2>
          <div className="flex items-center gap-4">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Pratinjau" className="w-12 h-12 rounded-full object-cover border border-gray-200 flex-shrink-0" />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <UserIcon />
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                name="profile_image"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFormData({ ...formData, profile_image: file, photo_url: URL.createObjectURL(file) });
                  }
                }}
                className="input-field text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Format: JPG, PNG. Maks 5MB.</p>
            </div>
          </div>
        </div>

        {/* Driver-specific */}
        {formData.role === 'DRIVER' && (
          <div className="card space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Informasi Driver</h2>

            <div className="form-group">
              <label htmlFor="vehicle_type" className="input-label">Jenis Kendaraan & Plat Nomor</label>
              <input
                id="vehicle_type"
                type="text"
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                className="input-field"
                placeholder="Honda Vario 150 · H 1234 AB"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bank_account" className="input-label">Nomor Rekening / E-Wallet</label>
              <input
                id="bank_account"
                type="text"
                name="bank_account"
                value={formData.bank_account}
                onChange={handleChange}
                className="input-field"
                placeholder="BCA · 123456789 · Budi Santoso"
              />
              <p className="text-xs text-gray-500 mt-1">Digunakan untuk pencairan saldo</p>
            </div>

            <div>
              <label className="input-label">Dokumen KTM</label>
              {formData.ktm_image ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-5 h-5 bg-green-100 text-green-600 rounded flex items-center justify-center flex-shrink-0"><CheckIcon /></span>
                    Dokumen KTM sudah diunggah
                  </div>
                  <a
                    href={`http://localhost:8000/media/${formData.ktm_image}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-sm font-medium text-primary-DEFAULT hover:text-primary-dark"
                  >
                    Lihat <ExternalLinkIcon />
                  </a>
                </div>
              ) : (
                <div className="px-4 py-3 rounded-lg border text-sm" style={{background: '#FEF2F2', borderColor: '#FECACA', color: '#DC2626'}}>
                  Belum ada dokumen KTM. Hubungi Admin untuk pembaruan.
                </div>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-full btn-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="spinner"></span> Menyimpan...</>
          ) : 'Simpan Perubahan'}
        </button>
      </form>
    </div>
  );
};

export default Profile;
