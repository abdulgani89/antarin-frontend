import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';
import { Link } from 'react-router-dom';
import ChatModal from '../components/ChatModal';
import DriverNavigateModal from '../components/DriverNavigateModal';
import ReportModal from '../components/ReportModal';

// Icons
const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const CarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ShoppingBagIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);
const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);
const MapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
    <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const AlertCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);
const StarFilledIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#D97706" stroke="#D97706" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const SignalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="2" y1="20" x2="2" y2="20"/><line x1="7" y1="20" x2="7" y2="14"/><line x1="12" y1="20" x2="12" y2="9"/><line x1="17" y1="20" x2="17" y2="4"/><line x1="22" y1="20" x2="22" y2="2"/>
  </svg>
);
const CheckBadgeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const ChevronUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);
const InboxIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity:0.3}}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
  </svg>
);
const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const STATUS_LABELS: Record<string, string> = {
  MATCHED: 'Diterima',
  GOING_TO_PICKUP: 'Menuju Lokasi',
  STORE_PREPARING: 'Toko Menyiapkan',
  PICKING_UP: 'Menjemput',
  DELIVERING: 'Mengantarkan',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const getNextStatusLabel = (status: string, serviceType: string) => {
  const map: Record<string, string> = {
    'MATCHED': serviceType === 'JASTIP' ? 'OTW ke Toko' : 'OTW Lokasi',
    'GOING_TO_PICKUP': serviceType === 'JASTIP' ? 'Toko Sedang Menyiapkan' : 'Tiba di Lokasi',
    'STORE_PREPARING': 'Input Harga Fiks',
    'PICKING_UP': serviceType === 'JASTIP' ? 'Input Harga Fiks' : 'Mulai Mengantar',
    'DELIVERING': 'Selesaikan Order',
  };
  return map[status] || 'Lanjut';
};

const DriverDashboard: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isReady, setIsReady] = useState(user?.is_ready || false);
  const [wallet, setWallet] = useState({ balance: 0, pending_balance: 0, available_balance: 0 });
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [reportOrderId, setReportOrderId] = useState<any>(null);
  const [jastipModalData, setJastipModalData] = useState<{isOpen: boolean, orderId: string, actualPrice: string, receiptImage?: File | null}>({isOpen: false, orderId: '', actualPrice: '', receiptImage: null});
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [chatPartyName, setChatPartyName] = useState<string>('');
  const [navOrder, setNavOrder] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const locationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAvailableOrders = async () => {
    try {
      const res = await api.get('orders/available/');
      setAvailableOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch available orders", err);
    }
  };

  useEffect(() => {
    if (isReady && user?.role === 'DRIVER') {
      fetchAvailableOrders();
      const interval = setInterval(fetchAvailableOrders, 5000);
      return () => clearInterval(interval);
    } else {
      setAvailableOrders([]);
    }
  }, [isReady, user]);

  const fetchActiveOrders = async () => {
    try {
      const res = await api.get('orders/');
      const active = res.data.filter((o: any) =>
        o.status !== 'COMPLETED' && o.status !== 'CANCELLED' && o.driver === user?.id
      );
      const history = res.data.filter((o: any) =>
        (o.status === 'COMPLETED' || o.status === 'CANCELLED') && o.driver === user?.id
      );
      setActiveOrders(active);
      setHistoryOrders(history);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    if (user?.role === 'DRIVER') {
      fetchActiveOrders();
    }
  }, [user]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('ratings/');
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    };
    if (user?.role === 'DRIVER') fetchReviews();
  }, [user]);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('wallet/balance/');
        setWallet(res.data);
      } catch (err) {
        console.error("Failed to fetch wallet", err);
      }
    };
    if (user?.role === 'DRIVER') {
      fetchWallet();
      const interval = setInterval(fetchWallet, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (isReady && user?.role === 'DRIVER') {
      const updateLocation = () => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            try {
              await api.put('auth/me/', {
                current_lat: position.coords.latitude,
                current_lng: position.coords.longitude
              });
            } catch (err) {
              console.error("Failed to update location", err);
            }
          }, () => {
            api.put('auth/me/', {
              current_lat: -7.050304 + (Math.random() * 0.001 - 0.0005),
              current_lng: 110.395669 + (Math.random() * 0.001 - 0.0005)
            }).catch(console.error);
          });
        }
      };
      updateLocation();
      locationIntervalRef.current = setInterval(updateLocation, 5000);
    }
    return () => {
      if (locationIntervalRef.current) clearInterval(locationIntervalRef.current);
    };
  }, [isReady, user]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      await api.post(`orders/${orderId}/accept/`);
      fetchAvailableOrders();
      fetchActiveOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menerima pesanan.");
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    try {
      await api.post(`orders/${orderId}/reject/`);
      fetchAvailableOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menolak pesanan.");
    }
  };

  const handleUpdateStatus = async (orderId: string, currentStatus: string, serviceType: string) => {
    if (serviceType === 'JASTIP' && (currentStatus === 'PICKING_UP' || currentStatus === 'STORE_PREPARING')) {
      setJastipModalData({ isOpen: true, orderId, actualPrice: '', receiptImage: null });
      return;
    }
    let statusMap: any = {
      'MATCHED': 'GOING_TO_PICKUP',
      'GOING_TO_PICKUP': 'PICKING_UP',
      'PICKING_UP': 'DELIVERING',
      'DELIVERING': 'COMPLETED'
    };
    if (serviceType === 'JASTIP') {
      statusMap = {
        'MATCHED': 'GOING_TO_PICKUP',
        'GOING_TO_PICKUP': 'STORE_PREPARING',
        'STORE_PREPARING': 'DELIVERING',
        'DELIVERING': 'COMPLETED'
      };
    }
    const nextStatus = statusMap[currentStatus];
    if (!nextStatus) return;
    try {
      await api.patch(`orders/${orderId}/`, { status: nextStatus });
      fetchActiveOrders();
    } catch {
      alert("Gagal update status");
    }
  };

  const submitJastipPrice = async () => {
    try {
      if (!jastipModalData.receiptImage) {
        alert("Mohon upload foto struk belanja terlebih dahulu!");
        return;
      }
      const formData = new FormData();
      formData.append('actual_item_total', jastipModalData.actualPrice);
      formData.append('receipt_image', jastipModalData.receiptImage);
      await api.post(`orders/${jastipModalData.orderId}/confirm_price/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setJastipModalData({ isOpen: false, orderId: '', actualPrice: '', receiptImage: null });
      fetchActiveOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal mengonfirmasi harga.");
    }
  };

  const formatRupiah = (amount: number) => `Rp ${parseInt(amount.toString()).toLocaleString('id-ID')}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-page-title">Halo, {user?.first_name || user?.username}</h1>
          <p className="text-body-sm mt-1">
            {isReady ? 'Kamu sedang online dan siap menerima order' : 'Aktifkan status READY untuk menerima order'}
          </p>
        </div>

        {/* Ready Toggle */}
        <div className="status-toggle shrink-0">
          <span className="text-sm font-medium text-gray-600">Status</span>
          <button
            onClick={async () => {
              const newStatus = !isReady;
              try {
                await api.put('auth/me/', { is_ready: newStatus });
                setIsReady(newStatus);
                updateUser({ is_ready: newStatus });
              } catch (e) {
                alert("Gagal mengubah status!");
              }
            }}
            className={`relative inline-flex h-6 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isReady ? 'bg-primary-DEFAULT focus:ring-primary-DEFAULT' : 'bg-gray-300 focus:ring-gray-300'}`}
            aria-label={isReady ? 'Set Not Ready' : 'Set Ready'}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${isReady ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
          <span className={`text-sm font-semibold ${isReady ? 'text-primary-DEFAULT' : 'text-gray-400'}`}>
            {isReady ? 'READY' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Wallet + Stats */}
      <div className="balance-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
              <WalletIcon />
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium mb-1">Saldo Tersedia</p>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">
                  {showBalance
                    ? formatRupiah(wallet.available_balance || 0)
                    : 'Rp ••••••••'}
                </span>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-gray-400 hover:text-white transition-colors p-1"
                >
                  {showBalance ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {wallet.pending_balance > 0 && (
                <p className="text-gray-500 text-xs mt-1">
                  Tertahan: {formatRupiah(wallet.pending_balance)}
                </p>
              )}
            </div>
          </div>
          <Link
            to="/wallet"
            className="btn btn-sm"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            Detail
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card card-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Rating</p>
          <div className="flex items-center justify-center gap-1">
            <StarFilledIcon />
            <span className="font-bold text-gray-900">{user?.average_rating?.toFixed(1) || '0.0'}</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">({user?.rating_count || 0} ulasan)</p>
        </div>
        <div className="card card-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Verifikasi</p>
          <div className={`flex items-center justify-center gap-1 text-sm font-semibold ${user?.is_verified_driver ? 'text-success' : 'text-danger'}`}>
            <CheckBadgeIcon />
            {user?.is_verified_driver ? 'Aktif' : 'Belum'}
          </div>
        </div>
        <div className="card card-sm text-center">
          <p className="text-xs text-gray-500 mb-1">Order Aktif</p>
          <p className="font-bold text-gray-900 text-base">{activeOrders.length}</p>
        </div>
      </div>

      {/* Active Orders */}
      {activeOrders.length > 0 && (
        <div>
          <div className="section-header">
            <h2 className="section-title">Sedang Dikerjakan</h2>
            <span className="badge badge-info">{activeOrders.length}</span>
          </div>
          <div className="space-y-3">
            {activeOrders.map((order, idx) => (
              <div key={idx} className="card card-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary-muted text-primary-DEFAULT`}>
                      {order.service_type === 'ANJEM' ? <CarIcon /> : <ShoppingBagIcon />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {order.service_type === 'ANJEM' ? 'Antar-Jemput' : 'Jasa Titip'}
                        <span className="text-gray-400 font-normal ml-1 text-xs">#{order.order_code}</span>
                      </p>
                      <span className={`badge border mt-1 inline-flex status-${order.status}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                    {formatRupiah(Number(order.total_amount))}
                  </p>
                </div>

                {/* Order Details */}
                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  {order.service_type === 'JASTIP' ? (
                    <>
                      <p><span className="font-medium text-gray-700">Toko:</span> {order.store_location}</p>
                      <p><span className="font-medium text-gray-700">Antar ke:</span> {order.destination_location}</p>
                      <p><span className="font-medium text-gray-700">Barang:</span> <em>{order.jastip_items}</em></p>
                      <p><span className="font-medium text-gray-700">Est. Harga:</span> {formatRupiah(Number(order.estimated_item_total))}</p>
                    </>
                  ) : (
                    <>
                      <p><span className="font-medium text-gray-700">Jemput:</span> {order.pickup_location}</p>
                      <p><span className="font-medium text-gray-700">Antar ke:</span> {order.destination_location}</p>
                    </>
                  )}
                  {order.customer_note && (
                    <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A'}}>
                      <span className="font-medium">Catatan:</span> {order.customer_note}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                  {['MATCHED', 'GOING_TO_PICKUP', 'PICKING_UP', 'DELIVERING'].includes(order.status) && (
                    <>
                      <button
                        onClick={() => { setChatOrderId(order.id); setChatPartyName(order.customer_details?.first_name || order.customer_details?.username || 'Customer'); }}
                        className="btn btn-sm btn-secondary flex items-center gap-1.5"
                      >
                        <MessageIcon /> Chat Customer
                      </button>
                      <button
                        onClick={() => setNavOrder(order)}
                        className="btn btn-sm btn-secondary flex items-center gap-1.5"
                      >
                        <MapIcon /> Buka Maps
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleUpdateStatus(order.id, order.status, order.service_type)}
                    className="btn btn-sm btn-primary flex items-center gap-1.5 ml-auto"
                  >
                    {getNextStatusLabel(order.status, order.service_type)}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Orders (Radar) */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Order Masuk</h2>
          {isReady && availableOrders.length > 0 && (
            <span className="badge badge-success">{availableOrders.length} tersedia</span>
          )}
        </div>

        {!isReady ? (
          <div className="card text-center py-10">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <SignalIcon />
            </div>
            <p className="font-medium text-gray-700">Kamu sedang offline</p>
            <p className="text-sm text-gray-400 mt-1">Aktifkan status READY di atas untuk menerima order</p>
          </div>
        ) : availableOrders.length === 0 ? (
          <div className="card text-center py-10">
            <InboxIcon />
            <p className="font-medium text-gray-600 mt-4">Menunggu order masuk...</p>
            <p className="text-sm text-gray-400 mt-1">Order baru akan muncul di sini secara otomatis</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOrders.map((order, idx) => (
              <div key={idx} className="card card-sm border-primary-light" style={{borderColor: '#CCFBF1'}}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-primary-muted text-primary-DEFAULT rounded-lg flex items-center justify-center flex-shrink-0">
                      {order.service_type === 'ANJEM' ? <CarIcon /> : <ShoppingBagIcon />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 text-sm">
                          {order.service_type === 'ANJEM' ? 'Antar-Jemput' : 'Jasa Titip'}
                        </p>
                        {order.status === 'DRIVER_SELECTED' && (
                          <span className="badge badge-warning text-xs">Request Khusus</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">#{order.order_code}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                    {formatRupiah(Number(order.shipping_fee))}
                  </p>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium text-gray-700">Jemput:</span> {order.pickup_location}</p>
                  <p><span className="font-medium text-gray-700">Tujuan:</span> {order.destination_location}</p>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                  {order.status === 'DRIVER_SELECTED' && (
                    <button
                      onClick={() => handleRejectOrder(order.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Tolak
                    </button>
                  )}
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="btn btn-sm btn-primary ml-auto"
                  >
                    Ambil Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Riwayat Pesanan</h2>
        </div>

        {historyOrders.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-sm text-gray-400">Belum ada riwayat pesanan</p>
          </div>
        ) : (
          <div className="space-y-2">
            {historyOrders.map((order, idx) => (
              <div key={idx} className="card card-sm">
                <div
                  className="flex items-center justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      {order.service_type === 'ANJEM' ? <CarIcon /> : <ShoppingBagIcon />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {order.service_type === 'ANJEM' ? 'Antar-Jemput' : 'Jasa Titip'}
                        <span className="text-gray-400 font-normal ml-1 text-xs">#{order.order_code}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{formatRupiah(Number(order.total_amount))}</p>
                      <span className={`badge border text-xs status-${order.status}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <span className="text-gray-400 ml-1">
                      {expandedOrderId === order.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium text-gray-700">Dari:</span> {order.pickup_location || order.store_location}</p>
                      <p><span className="font-medium text-gray-700">Tujuan:</span> {order.destination_location}</p>
                      <p><span className="font-medium text-gray-700">Customer:</span> {order.customer_details?.first_name || order.customer_details?.username || '-'}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setReportOrderId(order); }}
                      className="btn btn-sm btn-danger flex items-center gap-1.5 mt-2"
                    >
                      <AlertCircleIcon /> Laporkan Masalah
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div>
          <div className="section-header">
            <h2 className="section-title">Ulasan Pelanggan</h2>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {reviews.slice().reverse().map((review, idx) => (
              <div key={idx} className="card card-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    {review.customer_details?.profile_image ? (
                      <img
                        src={review.customer_details.profile_image}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary-muted text-primary-DEFAULT flex items-center justify-center font-semibold text-sm">
                        {(review.customer_details?.first_name || review.customer_details?.username || 'C')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {review.customer_details?.first_name || review.customer_details?.username || 'Customer'}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill={i < review.score ? '#D97706' : '#E5E7EB'} stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(review.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
                {review.review ? (
                  <p className="text-sm text-gray-600 italic">"{review.review}"</p>
                ) : (
                  <p className="text-sm text-gray-400">Tidak ada komentar tertulis.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Jastip Price Modal */}
      {jastipModalData.isOpen && (
        <div className="modal-overlay">
          <div className="modal-box max-w-md">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-section-title">Konfirmasi Harga Fiks</h3>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan harga sesuai struk belanja untuk menghitung total pembayaran pelanggan.
              </p>
            </div>
            <div className="p-5 space-y-4">
              <div className="form-group">
                <label className="input-label">Total Harga Barang (Rp)</label>
                <input
                  type="number"
                  value={jastipModalData.actualPrice}
                  onChange={e => setJastipModalData({...jastipModalData, actualPrice: e.target.value})}
                  placeholder="Contoh: 25000"
                  className="input-field text-lg font-semibold"
                />
              </div>
              <div className="form-group">
                <label className="input-label flex items-center gap-2">
                  <UploadIcon /> Foto Struk Belanja
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setJastipModalData({...jastipModalData, receiptImage: e.target.files ? e.target.files[0] : null})}
                  className="input-field text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">Wajib upload foto struk untuk membuktikan pembelian</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setJastipModalData({ isOpen: false, orderId: '', actualPrice: '', receiptImage: null })}
                  className="btn btn-secondary flex-1"
                >
                  Batal
                </button>
                <button
                  onClick={submitJastipPrice}
                  disabled={!jastipModalData.actualPrice}
                  className="btn btn-primary flex-1"
                >
                  Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {chatOrderId && (
        <ChatModal
          isOpen={!!chatOrderId}
          onClose={() => setChatOrderId(null)}
          orderId={chatOrderId}
          otherPartyName={chatPartyName}
        />
      )}
      {navOrder && (
        <DriverNavigateModal
          isOpen={!!navOrder}
          onClose={() => setNavOrder(null)}
          order={navOrder}
        />
      )}
      {reportOrderId && (
        <ReportModal
          isOpen={!!reportOrderId}
          onClose={() => setReportOrderId(null)}
          orderId={reportOrderId.id}
          reportedUserId={reportOrderId.customer}
          onSubmitSuccess={() => {}}
        />
      )}
    </div>
  );
};

export default DriverDashboard;
