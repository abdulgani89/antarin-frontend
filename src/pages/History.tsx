import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';

const History: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('orders/');
        setOrders(res.data);
      } catch (err: any) {
        setError('Gagal memuat riwayat pesanan');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      case 'SEARCHING_DRIVER': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      case 'SEARCHING_DRIVER': return 'Mencari Driver';
      case 'DRIVER_SELECTED': return 'Menunggu Konfirmasi Driver';
      case 'MATCHED': return 'Driver Menuju Lokasi';
      case 'PICKING_UP': return 'Proses Pesanan / Pembelian';
      case 'DELIVERING': return 'Dalam Perjalanan';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Pesanan</h2>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Memuat data...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <span className="text-6xl mb-4 block">📭</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada pesanan</h3>
          <p className="text-gray-500">Anda belum memiliki riwayat pesanan apapun.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.service_type === 'ANJEM' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}`}>
                    {order.service_type === 'ANJEM' ? '🚗 ANJEM' : '🛍️ JASTIP'}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="text-gray-400 text-xs font-medium">#{order.order_code}</span>
                </div>
                
                <div className="space-y-2 mt-4">
                  <div className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">📍</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Lokasi Jemput/Toko</p>
                      <p className="text-sm font-bold text-gray-900">{order.pickup_location || order.store_location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-red-500 mt-1">🎯</span>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Tujuan</p>
                      <p className="text-sm font-bold text-gray-900">{order.destination_location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-48 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">Total Biaya</p>
                  <p className="text-xl font-bold text-primary">Rp{order.total_amount}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.payment_method === 'CASH' ? '💵 Tunai' : '📱 QRIS'}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-gray-500 font-medium">
                    {user?.role === 'CUSTOMER' ? 'Driver:' : 'Customer:'}
                  </p>
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.role === 'CUSTOMER' ? 
                      (order.driver_details?.first_name || order.driver_details?.username || 'Menunggu Driver') : 
                      (order.customer_details?.first_name || order.customer_details?.username)}
                  </p>
                </div>
                
                <div className="text-xs text-gray-400 mt-2 text-right">
                  {new Date(order.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
