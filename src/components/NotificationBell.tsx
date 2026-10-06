import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

interface Notification {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  related_report_id: number | null;
  related_order_id: string | null;
  created_at: string;
}

const typeIcon: Record<string, string> = {
  REPORT_RESOLVED: '✅',
  REPORT_IN_REVIEW: '🔍',
  REPORT_WARNING: '⚠️',
  REPORT_SUSPENDED: '🛑',
  REFUND_RECEIVED: '💰',
  ORDER_UPDATE: '📦',
  GENERAL: '🔔',
};

function timeAgo(dateStr: string) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await api.get('notifications/');
      setNotifications(res.data.results || []);
      setUnreadCount(res.data.count || 0);
    } catch {
      // Silently fail — user might not be logged in yet
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 30s for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await api.patch(`notifications/${id}/mark_read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* ignore */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.post('notifications/mark_all_read/');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { /* ignore */ }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        id="notification-bell-btn"
        onClick={() => { setIsOpen(v => !v); if (!isOpen) fetchNotifications(); }}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
        title="Notifikasi"
        aria-label="Buka notifikasi"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          id="notification-panel"
          className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
          style={{ maxHeight: '420px', display: 'flex', flexDirection: 'column' }}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
            <span className="font-bold text-gray-900 text-sm flex items-center gap-2">
              🔔 Notifikasi
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} baru</span>
              )}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <span className="text-3xl mb-2">🔕</span>
                <p className="text-sm font-medium">Belum ada notifikasi</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${!notif.is_read ? 'bg-blue-50/60' : ''}`}
                  onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5 shrink-0">{typeIcon[notif.notification_type] || '🔔'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-semibold text-gray-900 truncate ${!notif.is_read ? 'font-bold' : ''}`}>
                          {notif.title}
                        </p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">{notif.message}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{timeAgo(notif.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
