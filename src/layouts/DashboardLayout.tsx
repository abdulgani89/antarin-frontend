import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import NotificationBell from '../components/NotificationBell';

// Lucide-style inline SVG icons
const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);



const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const LogOutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
  </svg>
);

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const displayName = user?.first_name || (user?.username ? user.username.split('@')[0] : 'Pengguna');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const profileImageUrl = user?.profile_image
    ? (user.profile_image.startsWith('http') ? user.profile_image : `http://localhost:8000${user.profile_image}`)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 z-50 flex flex-col transform transition-transform duration-300 ease-in-out shrink-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>

        {/* Brand */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-DEFAULT rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">ANTARIN</span>
          </div>
          <button
            className="md:hidden text-gray-400 hover:text-gray-700 p-1 rounded"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Tutup menu"
          >
            <XIcon />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profil" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="w-9 h-9 bg-primary-muted rounded-full flex items-center justify-center">
                <span className="text-primary-DEFAULT font-bold text-sm">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
              <span className="badge badge-primary text-xs capitalize">{user?.role?.toLowerCase()}</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">

          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon />
            <span>Beranda</span>
          </Link>

          {user?.role === 'CUSTOMER' && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pesan Layanan</p>
              </div>
              <Link
                to="/order/anjem"
                onClick={() => setIsSidebarOpen(false)}
                className={`nav-link ${isActive('/order/anjem') ? 'active' : ''}`}
              >
                <CarIcon />
                <span>Antar-Jemput</span>
              </Link>
              <Link
                to="/order/jastip"
                onClick={() => setIsSidebarOpen(false)}
                className={`nav-link ${isActive('/order/jastip') ? 'active' : ''}`}
              >
                <ShoppingBagIcon />
                <span>Jasa Titip</span>
              </Link>

              <div className="pt-3 pb-1 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Akun</p>
              </div>
              <Link
                to="/wallet"
                onClick={() => setIsSidebarOpen(false)}
                className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
              >
                <WalletIcon />
                <span>Dompet</span>
              </Link>
            </>
          )}

          {user?.role === 'DRIVER' && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Driver</p>
              </div>
              <Link
                to="/wallet"
                onClick={() => setIsSidebarOpen(false)}
                className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
              >
                <WalletIcon />
                <span>Saldo & Tarik</span>
              </Link>
              <Link
                to="/history"
                onClick={() => setIsSidebarOpen(false)}
                className={`nav-link ${isActive('/history') ? 'active' : ''}`}
              >
                <HistoryIcon />
                <span>Riwayat</span>
              </Link>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <div className="pt-3 pb-1 px-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin</p>
              </div>
              <Link
                to="/wallet"
                onClick={() => setIsSidebarOpen(false)}
                className={`nav-link ${isActive('/wallet') ? 'active' : ''}`}
              >
                <WalletIcon />
                <span>Keuangan</span>
              </Link>
            </>
          )}

          <div className="pt-3 pb-1 px-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pengaturan</p>
          </div>
          <Link
            to="/profile"
            onClick={() => setIsSidebarOpen(false)}
            className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
          >
            <UserIcon />
            <span>Profil</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOutIcon />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:h-screen md:overflow-hidden">

        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-gray-500 hover:text-gray-900 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Buka menu"
            >
              <MenuIcon />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-DEFAULT rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-base font-bold text-gray-900">ANTARIN</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-gray-600">Halo, <strong className="text-gray-900">{displayName}</strong></span>
              <span className="badge badge-primary uppercase text-xs">{user?.role}</span>
            </div>
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="md:hidden btn btn-sm btn-secondary text-red-500 border-red-100"
              style={{ minHeight: '36px', padding: '6px 12px' }}
            >
              Keluar
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pb-20 md:pb-6">
          <Outlet />
        </div>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden bottom-nav fixed bottom-0 left-0 right-0 z-30">
          <Link
            to="/"
            className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeIcon />
            <span>Beranda</span>
          </Link>

          {user?.role === 'CUSTOMER' && (
            <>
              <Link
                to="/order/anjem"
                className={`bottom-nav-item ${isActive('/order/anjem') ? 'active' : ''}`}
              >
                <CarIcon />
                <span>Anjem</span>
              </Link>
              <Link
                to="/order/jastip"
                className={`bottom-nav-item ${isActive('/order/jastip') ? 'active' : ''}`}
              >
                <ShoppingBagIcon />
                <span>Jastip</span>
              </Link>
            </>
          )}

          {user?.role === 'DRIVER' && (
            <Link
              to="/history"
              className={`bottom-nav-item ${isActive('/history') ? 'active' : ''}`}
            >
              <HistoryIcon />
              <span>Riwayat</span>
            </Link>
          )}

          <Link
            to="/wallet"
            className={`bottom-nav-item ${isActive('/wallet') ? 'active' : ''}`}
          >
            <WalletIcon />
            <span>Dompet</span>
          </Link>

          <Link
            to="/profile"
            className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <UserIcon />
            <span>Profil</span>
          </Link>
        </nav>
      </main>
    </div>
  );
};

export default DashboardLayout;
