import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../store/AuthContext';

interface ChatModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  otherPartyName: string;
}

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const ChatModal: React.FC<ChatModalProps> = ({ orderId, isOpen, onClose, otherPartyName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`orders/${orderId}/chat/`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isOpen, orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await api.post(`orders/${orderId}/chat/`, { content: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message');
    }
  };

  if (!isOpen) return null;

  const initials = otherPartyName.charAt(0).toUpperCase();

  return (
    <div className="modal-overlay">
      <div className="modal-box max-w-md" style={{height: '580px', display: 'flex', flexDirection: 'column'}}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-muted rounded-full flex items-center justify-center">
              <span className="text-primary-DEFAULT font-bold text-sm">{initials}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{otherPartyName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <span className="text-xs text-gray-400">Dalam Pesanan</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost p-2"
            style={{minHeight: 'auto'}}
            aria-label="Tutup chat"
          >
            <XIcon />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <span className="spinner mx-auto mb-2" style={{display: 'block'}}></span>
                <p className="text-sm text-gray-400">Memuat pesan...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm font-medium text-gray-600">Belum ada pesan</p>
              <p className="text-xs text-gray-400 mt-1">Kirim pesan pertama untuk memulai percakapan</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender === user?.id;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={isMe ? 'chat-bubble-me' : 'chat-bubble-other'}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-1.5 ${isMe ? 'text-right text-teal-200' : 'text-gray-400'}`}>
                      {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 outline-none transition-all"
            style={{minHeight: '40px'}}
            onFocus={e => { e.target.style.borderColor = '#0F766E'; e.target.style.boxShadow = '0 0 0 3px rgba(15,118,110,0.1)'; }}
            onBlur={e => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none'; }}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="w-10 h-10 bg-primary-DEFAULT text-white rounded-full flex items-center justify-center transition-colors hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Kirim pesan"
          >
            <SendIcon />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;
