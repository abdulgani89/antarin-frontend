import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';

const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4z"/>
  </svg>
);

const ArrowDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);

const ArrowUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState({ balance: 0, pending_balance: 0, available_balance: 0 });
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState(user?.bank_account || '');
  const [accountName, setAccountName] = useState(user?.first_name ? `${user.first_name} ${user.last_name}`.trim() : '');
  const [withdrawMessage, setWithdrawMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpMethod, setTopUpMethod] = useState('QRIS');
  const [senderName, setSenderName] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [topUpMessage, setTopUpMessage] = useState({ type: '', text: '' });
  const [pendingTopups, setPendingTopups] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);

  const [activeTab, setActiveTab] = useState<'withdraw' | 'topup'>('topup');

  const ADMIN_PAYMENT_INFO: Record<string, string> = {
    'QRIS': 'Scan QRIS atau hubungi WA Admin: 0812-3456-7890',
    'BCA': 'BCA · 1234567890 · a.n. Antarin Admin',
    'MANDIRI': 'Mandiri · 0987654321 · a.n. Antarin Admin',
    'GOPAY': 'GoPay · 0812-3456-7890 · a.n. Antarin',
    'DANA': 'DANA · 0812-3456-7890 · a.n. Antarin',
  };

  const fetchData = async () => {
    try {
      const [balanceRes, historyRes, pendingRes, withdrawalsRes] = await Promise.all([
        api.get('wallet/balance/'),
        api.get('wallet/history/'),
        api.get('wallet/pending_topups/'),
        api.get('wallet/withdrawals/')
      ]);
      setBalance(balanceRes.data);
      setHistory(historyRes.data);
      setPendingTopups(pendingRes.data);
      setPendingWithdrawals(withdrawalsRes.data.filter((w: any) => w.status === 'PENDING'));
    } catch (err) {
      console.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setWithdrawMessage({ type: '', text: '' });
    try {
      await api.post('wallet/withdrawals/', {
        amount: withdrawAmount,
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      });
      setWithdrawMessage({ type: 'success', text: 'Permintaan penarikan berhasil diajukan!' });
      setWithdrawAmount('');
      fetchData();
    } catch (err: any) {
      setWithdrawMessage({
        type: 'error',
        text: err.response?.data?.error || 'Gagal melakukan penarikan. Periksa saldo Anda.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTopUpMessage({ type: '', text: '' });
    const amount = parseInt(topUpAmount);
    if (isNaN(amount) || amount < 20000) {
      setTopUpMessage({ type: 'error', text: 'Minimal top up adalah Rp 20.000' });
      return;
    }
    setIsSubmitting(true);
    try {
      await api.post('wallet/topup/', { amount, method: topUpMethod, sender_name: senderName, sender_account: senderAccount });
      setTopUpMessage({ type: 'success', text: 'Permintaan top up berhasil. Menunggu konfirmasi admin.' });
      fetchData();
      setTimeout(() => {
        setShowTopUpModal(false);
        setTopUpAmount('');
        setSenderName('');
        setSenderAccount('');
        setTopUpMessage({ type: '', text: '' });
      }, 3000);
    } catch (err: any) {
      setTopUpMessage({ type: 'error', text: err.response?.data?.error || 'Gagal melakukan top up.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRupiah = (amount: number) => `Rp ${parseInt(amount.toString()).toLocaleString('id-ID')}`;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="skeleton h-32 rounded-xl" />
        <div className="skeleton h-64 rounded-xl" />
        <div className="skeleton h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <h1 className="text-page-title">Dompet</h1>

      {/* Balance Card */}
      <div className="balance-card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <WalletIcon />
              <p className="text-gray-400 text-sm">Saldo Tersedia</p>
            </div>
            <p className="text-3xl font-bold">{formatRupiah(balance.available_balance)}</p>
            {balance.pending_balance > 0 && (
              <p className="text-gray-500 text-xs mt-2">
                Tertahan: {formatRupiah(balance.pending_balance)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setShowTopUpModal(true); setTopUpMessage({ type: '', text: '' }); setTopUpAmount(''); }}
              className="btn btn-sm flex items-center gap-1.5"
              style={{background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)'}}
            >
              <PlusIcon /> Isi Saldo
            </button>
          </div>
        </div>
      </div>

      {/* Pending Notices */}
      {pendingWithdrawals.length > 0 && (
        <div className="px-4 py-3 rounded-lg text-sm" style={{background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1'}}>
          <p className="font-semibold mb-1">Penarikan Dana Menunggu Konfirmasi</p>
          {pendingWithdrawals.map(req => (
            <div key={req.id} className="flex justify-between items-center mt-1">
              <span>Tarik via {req.bank_name} · {req.account_number}</span>
              <span className="font-bold">{formatRupiah(Number(req.amount))}</span>
            </div>
          ))}
        </div>
      )}

      {pendingTopups.length > 0 && (
        <div className="px-4 py-3 rounded-lg text-sm" style={{background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E'}}>
          <p className="font-semibold mb-1">Top Up Menunggu Konfirmasi Admin</p>
          {pendingTopups.map(req => (
            <div key={req.id} className="flex justify-between items-center mt-1">
              <span>Top Up via {req.method}</span>
              <span className="font-bold">{formatRupiah(Number(req.amount))}</span>
            </div>
          ))}
        </div>
      )}

      {/* Withdraw Form */}
      {user?.role === 'DRIVER' && (
        <div className="card">
          <h2 className="section-title mb-4">Tarik Saldo</h2>

          {withdrawMessage.text && (
            <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${withdrawMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'text-red-600 border border-red-200'}`}
              style={withdrawMessage.type === 'error' ? {background: '#FEF2F2'} : {}}>
              {withdrawMessage.text}
            </div>
          )}

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div className="form-group">
              <label className="input-label">Jumlah Penarikan (min. Rp 20.000)</label>
              <input
                type="number"
                required
                min="20000"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="input-field"
                placeholder="20000"
              />
            </div>
            <div className="form-group">
              <label className="input-label">Nama Bank / E-Wallet</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="input-field"
                placeholder="BCA / GoPay / Dana"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="form-group">
                <label className="input-label">Nomor Rekening / HP</label>
                <input
                  type="text"
                  required
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="form-group">
                <label className="input-label">Atas Nama</label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-secondary btn-full flex items-center justify-center gap-2">
              {isSubmitting ? <><span className="spinner"></span> Memproses...</> : <><ArrowUpIcon /> Ajukan Penarikan</>}
            </button>
          </form>
        </div>
      )}

      {/* Customer Top Up Button */}
      {user?.role === 'CUSTOMER' && (
        <div className="card flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-gray-900">Top Up Saldo</p>
            <p className="text-sm text-gray-500 mt-0.5">Isi saldo untuk membayar pesanan lebih mudah</p>
          </div>
          <button
            onClick={() => { setShowTopUpModal(true); setTopUpMessage({ type: '', text: '' }); setTopUpAmount(''); }}
            className="btn btn-primary btn-sm whitespace-nowrap"
          >
            <PlusIcon /> Isi Saldo
          </button>
        </div>
      )}

      {/* Transaction History */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Riwayat Transaksi</h2>
        </div>

        {history.length === 0 ? (
          <div className="card text-center py-10">
            <p className="text-sm text-gray-400">Belum ada transaksi</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((tx) => {
              const isRejected = tx.description.toLowerCase().includes('ditolak');
              const isPositive = Number(tx.amount) > 0;

              let iconBg = isPositive ? '#F0FDF4' : '#FEF2F2';
              let iconColor = isPositive ? '#16A34A' : '#DC2626';
              let amountColor = isPositive && !isRejected ? '#16A34A' : '#DC2626';

              if (isRejected) {
                iconBg = '#FEF2F2';
                iconColor = '#DC2626';
              }

              return (
                <div key={tx.id} className="card card-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{background: iconBg, color: iconColor}}>
                      {isRejected ? <XIcon /> : isPositive ? <ArrowDownIcon /> : <ArrowUpIcon />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{tx.description}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(tx.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-sm flex-shrink-0" style={{color: amountColor}}>
                    {isPositive && !isRejected ? '+' : '-'}Rp{Math.abs(Number(tx.amount)).toLocaleString('id-ID')}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Top Up Modal */}
      {showTopUpModal && (
        <div className="modal-overlay">
          <div className="modal-box max-w-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-section-title">Top Up Saldo</h3>
              <button onClick={() => setShowTopUpModal(false)} className="btn btn-ghost btn-sm p-2">
                <XIcon />
              </button>
            </div>

            <div className="p-5">
              {topUpMessage.text && (
                <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${topUpMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'text-red-600 border border-red-200'}`}
                  style={topUpMessage.type === 'error' ? {background: '#FEF2F2'} : {}}>
                  {topUpMessage.text}
                </div>
              )}

              <form onSubmit={handleDeposit} className="space-y-4">
                <div className="form-group">
                  <label className="input-label">Nominal Top Up (min. Rp 20.000)</label>
                  <input
                    type="number"
                    required
                    min="20000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    className="input-field"
                    placeholder="20000"
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Transfer ke</label>
                  <select
                    value={topUpMethod}
                    onChange={(e) => setTopUpMethod(e.target.value)}
                    className="input-field"
                  >
                    <option value="QRIS">QRIS</option>
                    <option value="BCA">Transfer BCA</option>
                    <option value="MANDIRI">Transfer Mandiri</option>
                    <option value="GOPAY">GoPay</option>
                    <option value="DANA">DANA</option>
                  </select>
                </div>

                {/* Transfer info */}
                <div className="px-4 py-3 rounded-lg text-sm" style={{background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0369A1'}}>
                  <p className="font-medium mb-1">Silakan transfer ke:</p>
                  <p className="font-bold text-gray-900">{ADMIN_PAYMENT_INFO[topUpMethod]}</p>
                  <p className="text-xs mt-1" style={{color: '#0369A1'}}>Transfer sesuai nominal sebelum mengklik tombol di bawah.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="form-group">
                    <label className="input-label">No. Rek / HP Pengirim</label>
                    <input type="text" required value={senderAccount} onChange={(e) => setSenderAccount(e.target.value)} className="input-field" placeholder="0812xxxx" />
                  </div>
                  <div className="form-group">
                    <label className="input-label">Nama Pengirim</label>
                    <input type="text" required value={senderName} onChange={(e) => setSenderName(e.target.value)} className="input-field" placeholder="Budi" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary btn-full flex items-center justify-center gap-2">
                  {isSubmitting ? <><span className="spinner"></span> Memproses...</> : 'Saya Sudah Transfer'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
