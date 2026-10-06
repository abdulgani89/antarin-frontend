import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/AuthContext';

interface ChatBoxProps {
  orderCode: string;
  driverName?: string;
  customerName?: string;
}

interface Message {
  message: string;
  sender_id: number;
  created_at: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ orderCode, driverName, customerName }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${orderCode}/`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, [orderCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && ws.current && user) {
      ws.current.send(JSON.stringify({
        message: input,
        sender_id: user.id
      }));
      setInput('');
    }
  };

  const getSenderName = (senderId: number) => {
    if (senderId === user?.id) return 'Anda';
    return user?.role === 'CUSTOMER' ? (driverName || 'Driver') : (customerName || 'Customer');
  };

  return (
    <div className="flex flex-col h-[400px] bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100 bg-gray-50 rounded-t-xl flex justify-between items-center">
        <h3 className="font-bold text-gray-900">
          💬 Chat - {user?.role === 'CUSTOMER' ? driverName || 'Driver' : customerName || 'Customer'}
        </h3>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Online</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-3xl mb-2">👋</span>
            <p className="text-sm">Mulai percakapan</p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-400 mb-1 ml-1">{getSenderName(msg.sender_id)}</span>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] text-sm ${
                  isMe ? 'bg-primary text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        />
        <button 
          type="submit"
          disabled={!input.trim()}
          className="bg-primary hover:bg-green-500 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50"
        >
          ➤
        </button>
      </form>
    </div>
  );
};

export default ChatBox;
