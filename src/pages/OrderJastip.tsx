import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LocationPicker from '../components/LocationPicker';

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ShoppingBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const OrderJastip: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    store_location: '',
    store_lat: -7.051000,
    store_lng: 110.395000,
    destination_location: '',
    destination_lat: -7.049000,
    destination_lng: 110.400000,
    jastip_items: '',
    customer_note: '',
    payment_method: 'CASH',
    is_manual_driver: false,
    driver_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState<any[]>([]);
  const [estimatedPrice, setEstimatedPrice] = useState<{distance_km: number, shipping_fee: number} | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  React.useEffect(() => {
    api.get('drivers/').then(res => setDrivers(res.data)).catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  React.useEffect(() => {
    if (formData.store_lat && formData.store_lng && formData.destination_lat && formData.destination_lng) {
      const fetchPrice = async () => {
        try {
          const res = await api.post('orders/calculate_price/', {
            pickup_lat: formData.store_lat,
            pickup_lng: formData.store_lng,
            destination_lat: formData.destination_lat,
            destination_lng: formData.destination_lng
          });
          setEstimatedPrice(res.data);
        } catch (err) {
          console.error("Failed to calculate price", err);
        }
      };
      const timeoutId = setTimeout(fetchPrice, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.store_lat, formData.store_lng, formData.destination_lat, formData.destination_lng]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const payload = {
        service_type: 'JASTIP',
        store_location: formData.store_location,
        store_lat: formData.store_lat,
        store_lng: formData.store_lng,
        destination_location: formData.destination_location,
        destination_lat: formData.destination_lat,
        destination_lng: formData.destination_lng,
        pickup_location: formData.store_location,
        pickup_lat: formData.store_lat,
        pickup_lng: formData.store_lng,
        jastip_items: formData.jastip_items,
        estimated_item_total: 0,
        customer_note: formData.customer_note,
        payment_method: formData.payment_method,
        is_manual_driver: formData.is_manual_driver,
        driver: formData.is_manual_driver && formData.driver_id ? formData.driver_id : null,
      };
      await api.post('orders/', payload);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal membuat pesanan');
      setIsConfirming(false);
    } finally {
      setLoading(false);
    }
  };

  const totalFee = (estimatedPrice?.shipping_fee || 0) + (formData.is_manual_driver ? 2000 : 0);

  return (
    <div className="max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="btn btn-ghost btn-sm flex items-center gap-1.5 -ml-2">
          <ChevronLeftIcon />
          Kembali
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{background: '#FFF7ED', color: '#EA580C'}}>
          <ShoppingBagIcon />
        </div>
        <div>
          <h1 className="text-page-title">Pesan Jasa Titip</h1>
          <p className="text-body-sm">Titip beli tanpa perlu keluar</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg mb-5 text-sm flex items-start gap-2" style={{background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA'}}>
          <InfoIcon />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Locations */}
        <div className="card space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Lokasi Toko & Pengiriman</h2>
          <LocationPicker
            label="Lokasi Toko / Tempat Beli"
            initialLat={-7.051000}
            initialLng={110.395000}
            defaultAddress={formData.store_location}
            onLocationChange={(lat, lng, address) => {
              setFormData(prev => ({...prev, store_lat: lat, store_lng: lng, store_location: address}));
            }}
          />
          <LocationPicker
            label="Lokasi Pengantaran"
            initialLat={-7.049000}
            initialLng={110.400000}
            defaultAddress={formData.destination_location}
            onLocationChange={(lat, lng, address) => {
              setFormData(prev => ({...prev, destination_lat: lat, destination_lng: lng, destination_location: address}));
            }}
          />
        </div>

        {/* Items */}
        <div className="form-group">
          <label className="input-label">Daftar Barang yang Ingin Dititipkan</label>
          <textarea
            name="jastip_items"
            required
            value={formData.jastip_items}
            onChange={handleChange}
            rows={3}
            placeholder="Contoh: Ayam Geprek x1, Es Teh Manis x2, Kentang Goreng x1"
            className="input-field resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">Tulis secara detail agar driver tidak salah beli</p>
        </div>

        {/* Payment Method */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Metode Pembayaran Ongkir</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'CASH', label: 'Tunai', desc: 'Bayar langsung ke driver' },
              { value: 'SALDO', label: 'Saldo Dompet', desc: 'Potong otomatis dari saldo' },
            ].map(method => (
              <label
                key={method.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  formData.payment_method === method.value
                    ? 'border-primary-DEFAULT bg-primary-muted'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  value={method.value}
                  checked={formData.payment_method === method.value}
                  onChange={handleChange}
                  className="mt-0.5 accent-primary-DEFAULT"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{method.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{method.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Manual Driver */}
        <div className="card">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_manual_driver"
              checked={formData.is_manual_driver}
              onChange={handleChange}
              className="mt-1 w-4 h-4 accent-primary-DEFAULT rounded"
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Pilih Driver Sendiri</p>
              <p className="text-xs text-gray-500 mt-0.5">Tambahan biaya Rp 2.000 (Premium Fee)</p>
            </div>
          </label>

          {formData.is_manual_driver && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Driver Tersedia</p>
              {drivers.length === 0 ? (
                <p className="text-sm text-gray-400">Tidak ada driver yang sedang ready saat ini.</p>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {drivers.map(d => (
                    <label
                      key={d.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        formData.driver_id === String(d.id)
                          ? 'border-primary-DEFAULT bg-primary-muted'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="driver_id"
                        value={d.id}
                        checked={formData.driver_id === String(d.id)}
                        onChange={handleChange}
                        className="hidden"
                        required={formData.is_manual_driver}
                      />
                      <img
                        src={d.profile_image
                          ? (d.profile_image.startsWith('http') ? d.profile_image : `http://localhost:8000${d.profile_image}`)
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(d.first_name || d.username)}&background=F0FDFA&color=0F766E&bold=true`
                        }
                        alt="Driver"
                        className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{d.first_name || d.username}</p>
                        <p className="text-xs text-gray-500 truncate">{d.vehicle_type || 'Motor Standar'}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center gap-1 text-sm font-semibold" style={{color: '#D97706'}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="#D97706" stroke="none">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                          {d.average_rating ? d.average_rating.toFixed(1) : '0.0'}
                        </div>
                        <p className="text-xs text-gray-400">{d.rating_count || 0} ulasan</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Note */}
        <div className="form-group">
          <label className="input-label">Catatan Tambahan (opsional)</label>
          <textarea
            name="customer_note"
            value={formData.customer_note}
            onChange={handleChange}
            rows={2}
            placeholder="Contoh: Level pedas 5, tanpa bawang"
            className="input-field resize-none"
          />
        </div>

        {/* Price Summary */}
        {estimatedPrice && (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Estimasi Ongkos Jastip</h2>
            <div className="space-y-0">
              <div className="payment-row">
                <span>Jarak tempuh</span>
                <span className="font-medium text-gray-900">{estimatedPrice.distance_km} km</span>
              </div>
              <div className="divider" />
              <div className="payment-row">
                <span>Ongkos dasar</span>
                <span className="font-medium text-gray-900">Rp {estimatedPrice.shipping_fee.toLocaleString('id-ID')}</span>
              </div>
              {formData.is_manual_driver && (
                <>
                  <div className="divider" />
                  <div className="payment-row">
                    <span>Premium Fee</span>
                    <span className="font-medium text-gray-900">Rp 2.000</span>
                  </div>
                </>
              )}
              <div className="payment-total">
                <span>Total Ongkos</span>
                <span>Rp {totalFee.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>
        )}

        {/* Harga barang disclaimer */}
        <div className="flex items-start gap-2 px-4 py-3 rounded-lg text-sm" style={{background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A'}}>
          <AlertIcon />
          <span>Harga final barang dikonfirmasi driver setelah pembelian dan dibuktikan dengan struk.</span>
        </div>

        {/* Submit */}
        <div className="pt-2">
          {!isConfirming ? (
            <button
              type="submit"
              disabled={loading}
              className="btn btn-full btn-lg font-bold"
              style={{background: '#EA580C', color: '#fff', border: '1px solid #C2410C', borderRadius: '10px', minHeight: '52px'}}
            >
              Lanjutkan Pemesanan
            </button>
          ) : (
            <div className="card">
              <p className="text-sm font-semibold text-gray-900 mb-1">Konfirmasi Pesanan</p>
              <p className="text-sm text-gray-500 mb-4">
                {formData.payment_method === 'SALDO'
                  ? `Ongkos Rp ${totalFee.toLocaleString('id-ID')} akan dipotong dari saldo dompet.`
                  : `Bayar ongkos Rp ${totalFee.toLocaleString('id-ID')} secara tunai ke driver.`}
                {' '}Harga barang dibayar terpisah setelah konfirmasi driver.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  disabled={loading}
                  className="btn btn-secondary flex-1"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn flex-1 flex items-center justify-center gap-2"
                  style={{background: '#EA580C', color: '#fff', border: '1px solid #C2410C'}}
                >
                  {loading ? <><span className="spinner"></span> Memproses...</> : 'Pesan Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderJastip;
