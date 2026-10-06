import React from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">ANTARIN</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700 font-medium">{user?.username}</span>
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
            {user?.role}
          </span>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Selamat Datang, {user?.first_name || user?.username}!</h2>
          <p className="text-gray-600 mb-8">Ini adalah dashboard awal dari aplikasi ANTARIN.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold text-blue-900 mb-2">🚗 Pesan Anjem</h3>
              <p className="text-blue-700">Layanan antar-jemput khusus mahasiswa UNNES.</p>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-100 hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="text-xl font-bold text-orange-900 mb-2">🛍️ Pesan Jastip</h3>
              <p className="text-orange-700">Layanan jasa titip beli barang atau makanan.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
