import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import { FileText, Briefcase, Mail, Eye, PlusCircle, ArrowUpRight, Loader2 } from 'lucide-react';

const DashboardOverviewPage = () => {
  const [stats, setStats] = useState({ blogs: 0, projects: 0, messages: 0, unreadMessages: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const [blogRes, projRes, msgRes] = await Promise.all([
          api.get('/blogs?includeUnpublished=true'),
          api.get('/projects'),
          api.get('/contact'),
        ]);

        const blogs = blogRes.data.data || [];
        const projects = projRes.data.data || [];
        const messages = msgRes.data.data || [];

        setStats({
          blogs: blogs.length,
          projects: projects.length,
          messages: messages.length,
          unreadMessages: messages.filter((m) => !m.isRead).length,
        });
        setRecentMessages(messages.slice(0, 4));
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm">Loading CMS metrics...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Articles', count: stats.blogs, link: '/admin/blogs', icon: FileText, color: 'text-blue-400' },
    { label: 'Active Projects', count: stats.projects, link: '/admin/projects', icon: Briefcase, color: 'text-indigo-400' },
    { label: 'Messages', count: stats.messages, link: '/admin/messages', icon: Mail, color: 'text-emerald-400', badge: stats.unreadMessages > 0 ? `${stats.unreadMessages} Unread` : null },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400 mt-1">Live metrics and content overview from MongoDB Atlas.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="bg-dark-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col justify-between transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-white">{card.count}</span>
                {card.badge && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-rose-500/20 text-rose-300">
                    {card.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link
          to="/admin/blogs/new"
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Compose New Article</span>
        </Link>
        <Link
          to="/admin/projects"
          className="px-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 hover:border-slate-500 text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Briefcase className="w-4 h-4" />
          <span>Manage Projects</span>
        </Link>
      </div>

      {/* Recent Inquiries Table */}
      <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Recent Inbound Messages</h2>
          <Link to="/admin/messages" className="text-xs text-blue-400 hover:underline">
            View All
          </Link>
        </div>
        {recentMessages.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No contact messages received yet.</div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentMessages.map((msg) => (
              <div key={msg._id} className="p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{msg.name}</span>
                    {!msg.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" title="Unread" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate max-w-md mt-0.5">{msg.subject}</p>
                </div>
                <span className="text-xs text-slate-500 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverviewPage;