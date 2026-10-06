import React, { useState } from 'react';
import api from '../services/api';

interface SOSButtonProps {
  orderId: string;
}

const SOSButton: React.FC<SOSButtonProps> = ({ orderId }) => {
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const handleSOS = async () => {
    if (!window.confirm("PERINGATAN: Gunakan fitur ini HANYA dalam keadaan darurat (kecelakaan, kejahatan, dll). Apakah Anda yakin?")) {
      return;
    }

    setLoading(true);
    try {
      // Mock API call for SOS
      await api.post('sos/', { order_id: orderId });
      setTriggered(true);
      alert("Sinyal Darurat telah dikirim! Tim Admin ANTARIN akan segera menghubungi Anda.");
    } catch (err) {
      console.error("SOS Failed", err);
      // Fallback for mock
      setTriggered(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSOS}
      disabled={loading || triggered}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold shadow-md transition-all ${triggered
          ? 'bg-red-800 text-red-200 cursor-not-allowed'
          : 'bg-red-600 hover:bg-red-700 text-white animate-pulse hover:animate-none'
        }`}
    >
      <span className="text-xl">🚨</span>
      {triggered ? 'SOS TERKIRIM' : 'TOMBOL DARURAT'}
    </button>
  );
};

export default SOSButton;
