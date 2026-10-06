import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/api';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_customers: 0,
    total_drivers: 0,
    total_orders: 0,
    completed_orders: 0,
    pending_withdrawals: 0,
    total_revenue: 0,
    total_customer_balance: 0,
    total_driver_balance: 0
  });

  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [approvedUsers, setApprovedUsers] = useState<any[]>([]);
  const [pendingTopups, setPendingTopups] = useState<any[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [resolvingReportId, setResolvingReportId] = useState<number | null>(null);
  const [resolveForm, setResolveForm] = useState({ action_taken: 'NONE', admin_notes: '' });

  const fetchStats = async () => {
    try {
      const res = await api.get('admin/dashboard_stats/');
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await api.get('admin/pending_users/');
      setPendingUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch pending users", err);
    }
  };

  const fetchApprovedUsers = async () => {
    try {
      const res = await api.get('admin/approved_users/');
      setApprovedUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch approved users", err);
    }
  };

  const fetchPendingWalletRequests = async () => {
    try {
      const [topupsRes, wdsRes] = await Promise.all([
        api.get('wallet/admin/pending_topups/'),
        api.get('wallet/admin/pending_withdrawals/')
      ]);
      setPendingTopups(topupsRes.data);
      setPendingWithdrawals(wdsRes.data);
    } catch (err) {
      console.error("Failed to fetch pending wallet requests", err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('reports/');
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports", err);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStats();
      fetchPendingUsers();
      fetchApprovedUsers();
      fetchPendingWalletRequests();
      fetchReports();
    }
  }, [user]);

  const handleApproveUser = async (userId: string) => {
    try {
      await api.post('admin/approve_user/', { user_id: userId });
      alert("Pengguna berhasil disetujui!");
      fetchPendingUsers();
      fetchApprovedUsers();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menyetujui pengguna.");
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!window.confirm("Yakin ingin MENOLAK pengguna ini? Data mereka akan dihapus permanen.")) return;

    try {
      const res = await api.post('admin/reject_user/', { user_id: userId });
      alert(res.data.status || "Pendaftaran ditolak.");
      fetchPendingUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menolak pengguna.");
    }
  };

  const handleWalletAction = async (type: 'topup' | 'withdrawal', action: 'approve' | 'reject', id: number) => {
    try {
      await api.post(`wallet/admin/${id}/${action}_${type}/`);
      alert("Berhasil!");
      fetchPendingWalletRequests();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.error || "Terjadi kesalahan.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Yakin ingin MENGHAPUS pengguna ini secara permanen?")) return;

    try {
      const res = await api.post('admin/delete_user/', { user_id: userId });
      alert(res.data.status || "Pengguna berhasil dihapus.");
      fetchApprovedUsers();
      fetchStats();
    } catch (err: any) {
      alert(err.response?.data?.error || "Gagal menghapus pengguna.");
    }
  };

  const handleResolveReport = async (reportId: number) => {
    if (!resolveForm.admin_notes.trim()) {
      alert('Wajib mengisi catatan solusi untuk Admin.');
      return;
    }
    try {
      await api.post(`reports/${reportId}/resolve/`, resolveForm);
      alert('Laporan berhasil diselesaikan.');
      setResolvingReportId(null);
      setResolveForm({ action_taken: 'NONE', admin_notes: '' });
      fetchReports();
      fetchApprovedUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menyelesaikan laporan.');
    }
  };

  const handleMarkInReview = async (reportId: number) => {
    try {
      await api.post(`reports/${reportId}/mark_in_review/`);
      fetchReports();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal memperbarui status.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-page-title">Admin Panel</h1>
          <p className="text-body-sm mt-1">Ringkasan operasional ANTARIN</p>
        </div>
        <span className="badge badge-primary uppercase">Administrator</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="card card-sm">
          <p className="text-body-sm text-xs mb-1">Total Customer</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_customers}</p>
        </div>
        <div className="card card-sm">
          <p className="text-body-sm text-xs mb-1">Total Driver</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_drivers}</p>
        </div>
        <div className="card card-sm">
          <p className="text-body-sm text-xs mb-1">Total Order</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
        </div>
        <div className="card card-sm">
          <p className="text-body-sm text-xs mb-1">Pendapatan Admin</p>
          <p className="text-lg font-bold text-gray-900">Rp {Number(stats.total_revenue).toLocaleString('id-ID')}</p>
        </div>
        <div className="card card-sm">
          <p className="text-body-sm text-xs mb-1">Saldo Customer</p>
          <p className="text-lg font-bold text-gray-900">Rp {Number(stats.total_customer_balance).toLocaleString('id-ID')}</p>
        </div>
        <div className="card card-sm">
          <p className="text-body-sm text-xs mb-1">Saldo Driver</p>
          <p className="text-lg font-bold text-gray-900">Rp {Number(stats.total_driver_balance).toLocaleString('id-ID')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="section-title mb-4">Verifikasi Pengguna</h2>

          {pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-400">Semua pengguna sudah disetujui.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingUsers.map((pUser) => (
                <div key={pUser.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{pUser.first_name} {pUser.last_name}</p>
                      <p className="text-xs text-gray-500 truncate">{pUser.email}</p>
                      <span className="badge badge-info text-xs mt-1">{pUser.role}</span>
                      {pUser.ktm_image && (
                        <div className="mt-2">
                          <a href={`http://localhost:8000/media/${pUser.ktm_image}`} target="_blank" rel="noreferrer" className="text-xs text-primary-DEFAULT hover:underline font-medium">Lihat Foto KTM</a>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => handleApproveUser(pUser.id)}
                        className="btn btn-sm"
                        style={{background:'#F0FDF4',color:'#16A34A',border:'1px solid #BBF7D0'}}
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleRejectUser(pUser.id)}
                        className="btn btn-sm btn-danger"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="card overflow-y-auto" style={{maxHeight:'480px'}}>
          <h2 className="section-title mb-4">Permintaan Dana</h2>

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Penarikan</p>
          {pendingWithdrawals.length === 0 ? (
            <p className="text-sm text-gray-400 mb-4">Tidak ada permintaan penarikan.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {pendingWithdrawals.map((req) => (
                <div key={req.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Rp {Number(req.amount).toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-500">{req.bank_name} · {req.account_number} · {req.account_name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleWalletAction('withdrawal', 'approve', req.id)}
                      className="btn btn-sm flex-1" style={{background:'#F0FDF4',color:'#16A34A',border:'1px solid #BBF7D0'}}>
                      Setujui
                    </button>
                    <button onClick={() => handleWalletAction('withdrawal', 'reject', req.id)}
                      className="btn btn-sm btn-danger flex-1">Tolak</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="divider my-4" />
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Top Up</p>
          {pendingTopups.length === 0 ? (
            <p className="text-sm text-gray-400">Tidak ada permintaan top up.</p>
          ) : (
            <div className="space-y-2">
              {pendingTopups.map((req) => (
                <div key={req.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Rp {Number(req.amount).toLocaleString('id-ID')}</p>
                      <p className="text-xs text-gray-500">via {req.method} · {req.sender_name} ({req.sender_account})</p>
                      <p className="text-xs text-gray-400">{new Date(req.created_at).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleWalletAction('topup', 'approve', req.id)}
                      className="btn btn-sm flex-1" style={{background:'#F0FDF4',color:'#16A34A',border:'1px solid #BBF7D0'}}>
                      Setujui
                    </button>
                    <button onClick={() => handleWalletAction('topup', 'reject', req.id)}
                      className="btn btn-sm btn-danger flex-1">Tolak</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card overflow-x-auto">
          <h2 className="section-title mb-4">Customer Aktif</h2>
          {approvedUsers.filter(u => u.role === 'CUSTOMER').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada customer aktif.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identitas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedUsers.filter(u => u.role === 'CUSTOMER').map((aUser) => (
                    <tr key={aUser.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {aUser.first_name} {aUser.last_name}
                          {aUser.is_active === false && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">BANNED</span>}
                        </div>
                        <div className="text-xs text-gray-500">ID: {aUser.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                        {aUser.email}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                        Rp{Number(aUser.wallet__balance || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        {aUser.ktm_image ? (
                          <a href={`http://localhost:8000/media/${aUser.ktm_image}`} target="_blank" rel="noreferrer" className="text-primary hover:text-green-700">Lihat KTM</a>
                        ) : (
                          <span className="text-gray-400">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        <button
                          onClick={() => handleDeleteUser(aUser.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-semibold shadow-sm transition-colors text-xs"
                        >
                          🗑️ Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card overflow-x-auto">
          <h2 className="section-title mb-4">Driver Aktif</h2>
          {approvedUsers.filter(u => u.role === 'DRIVER').length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Belum ada driver aktif.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identitas</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedUsers.filter(u => u.role === 'DRIVER').map((aUser) => (
                    <tr key={aUser.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {aUser.first_name} {aUser.last_name}
                          {aUser.is_active === false && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">BANNED</span>}
                        </div>
                        <div className="text-xs text-gray-500">ID: {aUser.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-xs text-gray-900">{aUser.email}</div>
                        <div className="text-xs text-gray-500 mt-1 font-semibold">{aUser.bank_account || '-'}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{aUser.vehicle_type || '-'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-900">
                        Rp{Number(aUser.wallet__balance || 0).toLocaleString('id-ID')}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        {aUser.ktm_image ? (
                          <a href={`http://localhost:8000/media/${aUser.ktm_image}`} target="_blank" rel="noreferrer" className="text-primary hover:text-green-700">Lihat KTM</a>
                        ) : (
                          <span className="text-gray-400">Tidak ada</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs font-medium">
                        <button
                          onClick={() => handleDeleteUser(aUser.id)}
                          className="btn btn-sm btn-danger"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="section-title">Pengelolaan Laporan</h2>
            <p className="text-xs text-gray-500 mt-1">Akun otomatis disuspend jika ada 3+ laporan dalam 7 hari.</p>
          </div>
          <span className="badge badge-danger">
            {reports.filter((r: any) => r.status !== 'RESOLVED').length} Aktif
          </span>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">Tidak ada laporan masalah aktif.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((report: any) => (
              <div key={report.id} className={`p-5 transition-colors ${
                report.is_high_priority ? 'bg-red-50' :
                report.status === 'RESOLVED' ? 'bg-green-50/50' :
                report.status === 'IN_REVIEW' ? 'bg-yellow-50/60' : ''
              }`}>
                {/* Header */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {report.is_high_priority && (
                    <span className="badge badge-danger uppercase">Prioritas Tinggi</span>
                  )}
                  <span className="font-semibold text-gray-800 text-sm">#{report.id} — Order {report.order_code}</span>
                  <span className={`badge ${report.status === 'PENDING' ? 'badge-warning' : report.status === 'IN_REVIEW' ? 'badge-info' : 'badge-success'}`}>
                    {report.status === 'PENDING' ? 'Menunggu' : report.status === 'IN_REVIEW' ? 'Sedang Ditinjau' : 'Selesai'}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500 mb-3">
                  <span>Pelapor: <strong className="text-gray-700">{report.reporter_details?.first_name || report.reporter_details?.username} ({report.reporter_details?.role})</strong></span>
                  {report.reported_user_details && (
                    <span>Dilaporkan: <strong className="text-gray-700">{report.reported_user_details?.first_name || report.reported_user_details?.username} ({report.reported_user_details?.role})</strong></span>
                  )}
                  <span>{new Date(report.created_at).toLocaleString('id-ID')}</span>
                </div>

                {/* Category + description */}
                {report.category && (
                  <span className="badge badge-warning mb-2">{report.category}</span>
                )}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-600 italic mb-3">
                  "{report.description}"
                </div>

                {/* Proof image */}
                {report.proof_image && (
                  <a href={`http://localhost:8000/media/${report.proof_image}`} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-primary-DEFAULT hover:text-primary-dark font-medium mb-3">
                    Lihat Bukti Lampiran
                  </a>
                )}

                {/* Admin notes if resolved */}
                {report.status === 'RESOLVED' && report.admin_notes && (
                  <div className="px-3 py-2 rounded-lg mb-3 text-sm" style={{background:'#F0FDF4',border:'1px solid #BBF7D0',color:'#166534'}}>
                    <span className="font-semibold">Catatan Admin: </span>
                    <span>{report.admin_notes}</span>
                    {report.action_taken && report.action_taken !== 'NONE' && (
                      <span className="ml-2 badge badge-danger uppercase text-xs">{report.action_taken.replace(/_/g, ' ')}</span>
                    )}
                  </div>
                )}

                {/* Action area */}
                {report.status !== 'RESOLVED' && (
                  <div className="mt-3">
                    {resolvingReportId === report.id ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                        <h4 className="font-semibold text-gray-800 text-sm">Pilih Tindakan & Tulis Catatan</h4>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {[
                            { value: 'NONE', label: 'Tidak Ada Tindakan', emoji: '—' },
                            { value: 'WARNING', label: 'Peringatan', emoji: '⚡' },
                            { value: 'REFUND', label: 'Refund Saldo', emoji: '💰' },
                            { value: 'SUSPEND_1W', label: 'Suspend 1 Minggu', emoji: '🔒' },
                            { value: 'SUSPEND_1M', label: 'Suspend 1 Bulan', emoji: '🔒' },
                            { value: 'SUSPEND_PERMANENT', label: 'Suspend Permanen', emoji: '⛔' },
                          ].map(opt => (
                            <label key={opt.value} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-xs font-semibold transition-all ${
                              resolveForm.action_taken === opt.value
                                ? 'border-primary-DEFAULT bg-primary-muted text-primary-DEFAULT'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}>
                              <input type="radio" name={`action_${report.id}`} value={opt.value}
                                checked={resolveForm.action_taken === opt.value}
                                onChange={() => setResolveForm((f: any) => ({ ...f, action_taken: opt.value }))}
                                className="hidden" />
                              {opt.label}
                            </label>
                          ))}
                        </div>

                        <textarea
                          value={resolveForm.admin_notes}
                          onChange={e => setResolveForm((f: any) => ({ ...f, admin_notes: e.target.value }))}
                          placeholder="Tulis catatan solusi untuk pelapor (wajib diisi)..."
                          rows={3}
                          className="input-field resize-none"
                        />

                        <div className="flex gap-2">
                          <button onClick={() => { setResolvingReportId(null); setResolveForm({ action_taken: 'NONE', admin_notes: '' }); }}
                            className="btn btn-secondary flex-1">
                            Batal
                          </button>
                          <button onClick={() => handleResolveReport(report.id)}
                            className="btn btn-primary flex-1">
                            Selesaikan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {report.status === 'PENDING' && (
                          <button onClick={() => handleMarkInReview(report.id)}
                            className="btn btn-sm" style={{background:'#FFFBEB',color:'#D97706',border:'1px solid #FDE68A'}}>
                            Tandai Ditinjau
                          </button>
                        )}
                        <button
                          onClick={() => { setResolvingReportId(report.id); setResolveForm({ action_taken: 'NONE', admin_notes: '' }); }}
                          className="btn btn-sm btn-primary">
                          Selesaikan
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
