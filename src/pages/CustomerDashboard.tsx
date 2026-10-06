import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ChatModal from '../components/ChatModal';
import TrackDriverModal from '../components/TrackDriverModal';
import RatingModal from '../components/RatingModal';
import ReportModal from '../components/ReportModal';

// Icons
const CarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const StarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const InboxIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.3}}>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"/>
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

// Status label map
const STATUS_LABELS: Record<string, string> = {
  SEARCHING_DRIVER: 'Mencari Driver',
  DRIVER_SELECTED: 'Driver Dipilih',
  MATCHED: 'Driver Diterima',
  GOING_TO_PICKUP: 'Driver Menuju',
  STORE_PREPARING: 'Toko Menyiapkan',
  PICKING_UP: 'Sedang Dijemput',
  DELIVERING: 'Dalam Pengiriman',
  COMPLETED: 'Selesai',
  CANCELLED: 'Dibatalkan',
};

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [chatOrderId, setChatOrderId] = useState<string | null>(null);
  const [chatPartyName, setChatPartyName] = useState<string>('');
  const [trackOrderId, setTrackOrderId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [reportOrderId, setReportOrderId] = useState<any>(null);
  const [skippedRatings, setSkippedRatings] = useState<string[]>(() => {
    const saved = localStorage.getItem('skippedRatings');
    return saved ? JSON.parse(saved) : [];
  });
  const [ratingOrder, setRatingOrder] = useState<any>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [showBalance, setShowBalance] = useState<boolean>(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('orders/');
        const active = res.data.filter((o: any) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
        const history = res.data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'CANCELLED');
        setActiveOrders(active);
        setHistoryOrders(history);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    };
    if (user?.role === 'CUSTOMER') {
      fetchOrders();
      api.get('wallet/balance/').then(res => setWalletBalance(res.data.balance)).catch(err => console.error(err));
      const interval = setInterval(() => {
        fetchOrders();
        api.get('wallet/balance/').then(res => setWalletBalance(res.data.balance)).catch(err => console.error(err));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('skippedRatings', JSON.stringify(skippedRatings));
  }, [skippedRatings]);

  useEffect(() => {
    if (!ratingOrder && historyOrders.length > 0) {
      const mostRecentCompleted = historyOrders.find(o => o.status === 'COMPLETED');
      if (mostRecentCompleted && !mostRecentCompleted.has_rating && !skippedRatings.includes(mostRecentCompleted.id)) {
        setRatingOrder(mostRecentCompleted);
      }
    }
  }, [historyOrders, ratingOrder, skippedRatings]);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Yakin ingin membatalkan pesanan ini?")) return;
    try {
      await api.post(`orders/${orderId}/cancel/`);
      const res = await api.get('orders/');
      const active = res.data.filter((o: any) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
      const history = res.data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'CANCELLED');
      setActiveOrders(active);
      setHistoryOrders(history);
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal membatalkan pesanan.");
    }
  };

  const formatRupiah = (amount: number) => {
    return `Rp ${parseInt(amount.toString()).toLocaleString('id-ID')}`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Greeting */}
      <div>
        <h1 className="text-page-title">Halo, {user?.first_name || user?.username}</h1>
        <p className="text-body-sm mt-1">Mau pesan apa hari ini?</p>
      </div>

      {/* Wallet Balance */}
      <div className="balance-card flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
            <WalletIcon />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium mb-1">Saldo Dompet</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold">
                {showBalance
                  ? (walletBalance !== null ? formatRupiah(walletBalance) : 'Rp ...')
                  : 'Rp ••••••••'}
              </span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label={showBalance ? "Sembunyikan saldo" : "Tampilkan saldo"}
              >
                {showBalance ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>
        </div>
        <Link
          to="/wallet"
          className="btn btn-sm"
          style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}
        >
          Isi Saldo
        </Link>
      </div>

      {/* Service Cards */}
      <div className="space-y-3">
        <Link to="/order/anjem" className="service-card group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-primary-muted rounded-xl flex items-center justify-center text-primary-DEFAULT">
              <CarIcon />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Antar-Jemput</h3>
              <p className="text-sm text-gray-500 mt-0.5">Antar kamu ke tujuan dengan mudah</p>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-primary-DEFAULT transition-colors">
            <ChevronRightIcon />
          </div>
        </Link>

        <Link to="/order/jastip" className="service-card group">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{background: '#FFF7ED', color: '#EA580C'}}>
              <ShoppingBagIcon />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Jasa Titip</h3>
              <p className="text-sm text-gray-500 mt-0.5">Titip beli tanpa perlu keluar</p>
            </div>
          </div>
          <div className="text-gray-400 group-hover:text-primary-DEFAULT transition-colors">
            <ChevronRightIcon />
          </div>
        </Link>
      </div>

      {/* Active Orders */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Pesanan Aktif</h2>
          {activeOrders.length > 0 && (
            <span className="badge badge-info">{activeOrders.length} aktif</span>
          )}
        </div>

        {activeOrders.length === 0 ? (
          <div className="card flex flex-col items-center justify-center py-10 text-center">
            <InboxIcon />
            <p className="font-medium text-gray-600 mt-4">Belum ada pesanan aktif</p>
            <p className="text-sm text-gray-400 mt-1">Pesanan yang berjalan akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map((order, idx) => (
              <div key={idx} className="card card-sm">
                {/* Order Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${order.service_type === 'ANJEM' ? 'bg-primary-muted text-primary-DEFAULT' : 'text-orange-600'}`}
                      style={order.service_type === 'JASTIP' ? {background: '#FFF7ED'} : {}}>
                      {order.service_type === 'ANJEM' ? <CarIcon /> : <ShoppingBagIcon />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {order.service_type === 'ANJEM' ? 'Antar-Jemput' : 'Jasa Titip'}
                        <span className="text-gray-400 font-normal ml-1 text-xs">#{order.order_code}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`badge border ${`status-${order.status}`}`}>
                          {STATUS_LABELS[order.status] || order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-900 text-sm">
                      {formatRupiah(Number(order.total_amount))}
                    </p>
                    {order.receipt_image && (
                      <a
                        href={order.receipt_image}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-primary-DEFAULT hover:underline mt-1"
                      >
                        <ReceiptIcon />
                        Lihat Struk
                      </a>
                    )}
                  </div>
                </div>

                {/* Destination */}
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <MapPinIcon />
                  <span className="truncate">{order.destination_location}</span>
                </div>

                {/* Actions */}
                {(
                  ['SEARCHING_DRIVER', 'DRIVER_SELECTED', 'MATCHED'].includes(order.status) ||
                  ['MATCHED', 'GOING_TO_PICKUP', 'STORE_PREPARING', 'PICKING_UP', 'DELIVERING'].includes(order.status)
                ) && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                    {['SEARCHING_DRIVER', 'DRIVER_SELECTED', 'MATCHED'].includes(order.status) && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Batalkan
                      </button>
                    )}
                    {['MATCHED', 'GOING_TO_PICKUP', 'STORE_PREPARING', 'PICKING_UP', 'DELIVERING'].includes(order.status) && (
                      <>
                        <button
                          onClick={() => {
                            setChatOrderId(order.id);
                            setChatPartyName(order.driver_details?.first_name || order.driver_details?.username || 'Driver');
                          }}
                          className="btn btn-sm btn-secondary flex items-center gap-1.5"
                        >
                          <MessageIcon />
                          Chat Driver
                        </button>
                        <button
                          onClick={() => setTrackOrderId(order.id)}
                          className="btn btn-sm btn-primary flex items-center gap-1.5"
                        >
                          <MapPinIcon />
                          Lacak Driver
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Orders */}
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
                  className="flex items-start justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${order.service_type === 'ANJEM' ? 'bg-gray-100 text-gray-500' : 'bg-gray-100 text-gray-500'}`}>
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
                      <span className={`badge border text-xs ${`status-${order.status}`}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <span className="text-gray-400 ml-1">
                      {expandedOrderId === order.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                    </span>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div className="space-y-1">
                        <p><span className="font-medium text-gray-700">Dari:</span> {order.pickup_location || order.store_location}</p>
                        <p><span className="font-medium text-gray-700">Tujuan:</span> {order.destination_location}</p>
                        {order.service_type === 'JASTIP' && (
                          <p><span className="font-medium text-gray-700">Barang:</span> {order.jastip_items}</p>
                        )}
                        <p><span className="font-medium text-gray-700">Driver:</span> {order.driver_details?.first_name || order.driver_details?.username || '-'}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {order.status === 'COMPLETED' && (
                          order.has_rating ? (
                            <span className="badge badge-success self-start">Sudah dinilai</span>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); setRatingOrder(order); }}
                              className="btn btn-sm self-start flex items-center gap-1.5"
                              style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}
                            >
                              <StarIcon />
                              Beri Rating Driver
                            </button>
                          )
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); setReportOrderId(order); }}
                          className="btn btn-sm btn-danger self-start flex items-center gap-1.5"
                        >
                          <AlertCircleIcon />
                          Laporkan Masalah
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {chatOrderId && (
        <ChatModal
          isOpen={!!chatOrderId}
          onClose={() => setChatOrderId(null)}
          orderId={chatOrderId}
          otherPartyName={chatPartyName}
        />
      )}
      {trackOrderId && (
        <TrackDriverModal
          isOpen={!!trackOrderId}
          onClose={() => setTrackOrderId(null)}
          orderId={trackOrderId}
        />
      )}
      {reportOrderId && (
        <ReportModal
          isOpen={!!reportOrderId}
          onClose={() => setReportOrderId(null)}
          orderId={reportOrderId.id}
          reportedUserId={reportOrderId.driver}
          onSubmitSuccess={() => {}}
        />
      )}
      {ratingOrder && (
        <RatingModal
          isOpen={!!ratingOrder}
          onClose={() => {
            setSkippedRatings(prev => [...prev, ratingOrder.id]);
            setRatingOrder(null);
          }}
          orderId={ratingOrder.id}
          driverName={ratingOrder.driver_details?.first_name || ratingOrder.driver_details?.username || 'Driver'}
          onSuccess={() => {
            setRatingOrder(null);
            const fetchOrders = async () => {
              const res = await api.get('orders/');
              const history = res.data.filter((o: any) => o.status === 'COMPLETED' || o.status === 'CANCELLED');
              setHistoryOrders(history);
            };
            fetchOrders();
          }}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
