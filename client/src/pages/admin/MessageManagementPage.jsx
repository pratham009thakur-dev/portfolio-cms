import React, { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import Toast from '../../components/common/Toast';
import { Mail, Trash2, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const MessageManagementPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setMessages(res.data.data || []);
    } catch {
      setToast({ message: 'Failed to retrieve messages', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      await api.patch(`/contact/${id}`, { isRead: !currentStatus });
      setMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, isRead: !currentStatus } : m))
      );
      setToast({ message: 'Message status updated', type: 'success' });
    } catch {
      setToast({ message: 'Failed to update message status', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setToast({ message: 'Message deleted', type: 'success' });
    } catch {
      setToast({ message: 'Failed to delete message', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div>
        <h1 className="text-2xl font-bold text-white">Inbound Contact Submissions</h1>
        <p className="text-xs text-slate-400 mt-1">Direct inquiries submitted through the portfolio contact form.</p>
      </div>

      {loading ? (
        <div className="py-24 text-center flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Loading messages...</span>
        </div>
      ) : messages.length === 0 ? (
        <div className="py-20 text-center bg-dark-900 border border-slate-800 rounded-2xl text-slate-500 text-sm">
          No contact messages currently found in MongoDB.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-6 rounded-2xl border transition-all ${
                msg.isRead
                  ? 'bg-dark-900 border-slate-800 text-slate-400'
                  : 'bg-dark-900/90 border-blue-500/40 text-slate-200 shadow-lg shadow-blue-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-white text-base">{msg.name}</span>
                  <a href={`mailto:${msg.email}`} className="text-xs text-blue-400 hover:underline">
                    {msg.email}
                  </a>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => handleToggleRead(msg._id, msg.isRead)}
                    className="hover:text-white transition-colors"
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${msg.isRead ? 'text-slate-600' : 'text-blue-400'}`} />
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="hover:text-rose-400 transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-300 mb-2">{msg.subject}</p>
              <p className="text-sm leading-relaxed text-slate-400 whitespace-pre-line bg-dark-950/60 p-4 rounded-xl border border-slate-800/60">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageManagementPage;