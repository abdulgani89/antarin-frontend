import React, { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  reportedUserId?: string;
  onSubmitSuccess: () => void;
}

const CUSTOMER_CATEGORIES = [
  'Driver tidak ramah',
  'Driver ugal-ugalan',
  'Driver minta biaya tambahan',
  'Barang hilang/rusak',
  'Driver tidak sesuai data',
  'Lainnya',
];

const DRIVER_CATEGORIES = [
  'Customer tidak bisa dihubungi',
  'Titik lokasi palsu',
  'Customer tidak mau bayar/kasar',
  'Customer membatalkan sepihak',
  'Lainnya',
];

const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, orderId, reportedUserId, onSubmitSuccess }) => {
  const { user } = useAuth();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  if (!isOpen) return null;

  const categories = user?.role === 'CUSTOMER' ? CUSTOMER_CATEGORIES : DRIVER_CATEGORIES;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) { alert('Pilih kategori laporan.'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) { alert('Deskripsi laporan wajib diisi.'); return; }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('order', orderId);
      if (reportedUserId) formData.append('reported_user', reportedUserId);
      formData.append('category', category);
      formData.append('description', description);
      if (proofImage) formData.append('proof_image', proofImage);

      await api.post('reports/', formData);

      setCategory('');
      setDescription('');
      setProofImage(null);
      setStep(1);
      onSubmitSuccess();
      onClose();
      alert('✅ Laporan berhasil dikirim. Admin kami akan segera meninjaunya.');
    } catch (err: any) {
      console.error('Report error:', err.response?.data);
      // Build readable error message from DRF field errors
      const errData = err.response?.data;
      let errMsg = 'Terjadi kesalahan saat mengirim laporan.';
      if (errData) {
        if (typeof errData === 'string') {
          errMsg = errData;
        } else if (errData.error) {
          errMsg = errData.error;
        } else if (errData.detail) {
          errMsg = errData.detail;
        } else {
          // DRF field validation errors: { field: ["msg"] }
          errMsg = Object.entries(errData)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
            .join('\n');
        }
      }
      alert(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg">⚠️ Laporkan Masalah</h2>
              <p className="text-red-100 text-xs mt-0.5">Langkah {step} dari 2</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl leading-none">✕</button>
          </div>
          {/* Progress bar */}
          <div className="mt-4 h-1.5 bg-red-300/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Step 1: Choose category */}
        {step === 1 && (
          <form onSubmit={handleNext} className="p-6">
            <h3 className="font-bold text-gray-800 mb-1">Apa masalah yang Anda alami?</h3>
            <p className="text-gray-500 text-sm mb-5">Pilih kategori yang paling sesuai dengan kejadian.</p>

            <div className="grid grid-cols-1 gap-2">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all
                    ${category === cat
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-red-300 text-gray-700'
                    }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="hidden"
                  />
                  <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${category === cat ? 'border-red-500' : 'border-gray-400'}`}>
                    {category === cat && <span className="w-2 h-2 rounded-full bg-red-500 block" />}
                  </span>
                  <span className="text-sm font-medium">{cat}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              disabled={!category}
              className="w-full mt-6 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-100"
            >
              Lanjut →
            </button>
          </form>
        )}

        {/* Step 2: Description + proof */}
        {step === 2 && (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600 text-sm">← Kembali</button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 mb-5 inline-flex items-center gap-2">
              <span className="text-xs font-bold text-red-600">📌 Kategori:</span>
              <span className="text-xs text-red-700">{category}</span>
            </div>

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ceritakan Kronologi Kejadian <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail apa yang terjadi, kapan, dan bagaimana..."
              className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-colors mb-4 text-sm resize-none"
              required
            />

            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Bukti Foto / Screenshot <span className="text-gray-400 font-normal">(opsional, sangat dianjurkan)</span>
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors mb-6 ${proofImage ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-red-400'}`}>
              {proofImage ? (
                <div className="text-green-600 text-sm font-medium">
                  ✅ {proofImage.name}
                  <button type="button" onClick={() => setProofImage(null)} className="ml-3 text-red-400 hover:text-red-600 text-xs underline">Hapus</button>
                </div>
              ) : (
                <label className="cursor-pointer block">
                  <span className="text-3xl block mb-1">📷</span>
                  <span className="text-sm text-gray-500">Klik untuk memilih foto</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setProofImage(e.target.files?.[0] || null)} />
                </label>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading || !description.trim()}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-200 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-100"
              >
                {loading ? '⏳ Mengirim...' : '📤 Kirim Laporan'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportModal;
