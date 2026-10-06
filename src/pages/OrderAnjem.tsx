import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LocationPicker from '../components/LocationPicker';

const ChevronLeftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
  </svg>
);

const OrderAnjem: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    pickup_location: '',
    pickup_lat: -7.050304,
    pickup_lng: 110.395669,
    destination_location: '',
    destination_lat: -7.049000,
    destination_lng: 110.400000,
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
    api.get('drivers/')
      .then(res => setDrivers(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  React.useEffect(() => {
    if (formData.pickup_lat && formData.pickup_lng && formData.destination_lat && formData.destination_lng) {
      const fetchPrice = async () => {
        try {
          const res = await api.post('orders/calculate_price/', {
            pickup_lat: formData.pickup_lat,
            pickup_lng: formData.pickup_lng,
            destination_lat: formData.destination_lat,
            destination_lng: formData.destination_lng
          });
          setEstimatedPrice(res.data);
          setError('');
        } catch (err: any) {
          console.error("Failed to calculate price", err);
          setError("Gagal mengambil estimasi harga: " + (err.response?.data?.error || err.message));
        }
      };
      const timeoutId = setTimeout(fetchPrice, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [formData.pickup_lat, formData.pickup_lng, formData.destination_lat, formData.destination_lng]);

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
        service_type: 'ANJEM',
        pickup_location: formData.pickup_location,
        pickup_lat: formData.pickup_lat,
        pickup_lng: formData.pickup_lng,
        destination_location: formData.destination_location,
        destination_lat: formData.destination_lat,
        destination_lng: formData.destination_lng,
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
        <button
          onClick={() => navigate('/')}
          className="btn btn-ghost btn-sm flex items-center gap-1.5 -ml-2"
        >
          <ChevronLeftIcon />
          Kembali
        </button>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-muted rounded-xl flex items-center justify-center text-primary-DEFAULT">
          <CarIcon />
        </div>
        <div>
          <h1 className="text-page-title">Pesan Antar-Jemput</h1>
          <p className="text-body-sm">Antar kamu ke tujuan dengan mudah</p>
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
          <h2 className="text-sm font-semibold text-gray-700">Rute Perjalanan</h2>
          <LocationPicker
            label="Lokasi Penjemputan"
            initialLat={-7.050304}
            initialLng={110.395669}
            defaultAddress={formData.pickup_location}
            onLocationChange={(lat, lng, address) => {
              setFormData(prev => ({...prev, pickup_lat: lat, pickup_lng: lng, pickup_location: address}));
            }}
          />
          <LocationPicker
            label="Lokasi Tujuan"
            initialLat={-7.049000}
            initialLng={110.400000}
            defaultAddress={formData.destination_location}
            onLocationChange={(lat, lng, address) => {
              setFormData(prev => ({...prev, destination_lat: lat, destination_lng: lng, destination_location: address}));
            }}
          />
        </div>

        {/* Payment Method */}
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Metode Pembayaran</h2>
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
          <label className="input-label">Catatan untuk Driver (opsional)</label>
          <textarea
            name="customer_note"
            value={formData.customer_note}
            onChange={handleChange}
            rows={2}
            placeholder="Contoh: Saya pakai baju merah di depan Indomaret"
            className="input-field resize-none"
          />
        </div>

        {/* Price Summary */}
        {estimatedPrice && (
          <div className="card">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Ringkasan Biaya</h2>
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

        {/* Submit */}
        <div className="pt-2">
          {!isConfirming ? (
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-full btn-lg"
            >
              Lanjutkan Pemesanan
            </button>
          ) : (
            <div className="card">
              <p className="text-sm font-semibold text-gray-900 mb-1">Konfirmasi Pesanan</p>
              <p className="text-sm text-gray-500 mb-4">
                {formData.payment_method === 'SALDO'
                  ? `Saldo akan dipotong sebesar Rp ${totalFee.toLocaleString('id-ID')}.`
                  : `Bayar tunai Rp ${totalFee.toLocaleString('id-ID')} ke driver.`}
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
                  className="btn btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><span className="spinner"></span> Memproses...</>
                  ) : 'Pesan Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default OrderAnjem;
