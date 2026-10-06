import React, { useState } from 'react';
import api from '../services/api';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  driverName: string;
  onSuccess: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ isOpen, onClose, orderId, driverName, onSuccess }) => {
  const [score, setScore] = useState<number>(5);
  const [review, setReview] = useState<string>('');
  const [tip, setTip] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await api.post('ratings/', {
        order: orderId,
        score,
        review,
        tip: tip ? parseInt(tip) : 0
      });
      alert('Ulasan berhasil dikirim!');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Gagal mengirim ulasan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Beri Ulasan Driver</h3>
        <p className="text-gray-500 mb-6 text-sm">Bagaimana pengalaman Anda bersama {driverName}?</p>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setScore(star)}
                className={`text-4xl transition-transform ${score >= star ? 'text-yellow-400 scale-110' : 'text-gray-200'} hover:scale-110`}
              >
                ★
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan/Ulasan (Opsional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition-colors"
              rows={3}
              placeholder="Tuliskan pengalaman Anda..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tip untuk Driver (Opsional) - Dipotong dari Saldo
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 font-medium">Rp</span>
              <input
                type="number"
                value={tip}
                onChange={(e) => setTip(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-primary focus:border-primary transition-colors"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              disabled={isSubmitting}
            >
              Lewati
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
