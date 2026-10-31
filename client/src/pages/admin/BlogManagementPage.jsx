import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import Toast from '../../components/common/Toast';
import { Plus, Edit3, Trash2, Eye, EyeOff, Loader2, Search } from 'lucide-react';

const BlogManagementPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadBlogs();
  }, []);

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/blogs?includeUnpublished=true');
      setBlogs(res.data.data || []);
    } catch (err) {
      setToast({ message: 'Error retrieving blog posts', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (blog) => {
    try {
      const updatedStatus = !blog.isPublished;
      await api.put(`/blogs/${blog._id}`, { isPublished: updatedStatus });
      setToast({
        message: `Article ${updatedStatus ? 'published' : 'unpublished'} successfully!`,
        type: 'success',
      });
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, isPublished: updatedStatus } : b))
      );
    } catch {
      setToast({ message: 'Failed to update publication status', type: 'error' });
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this blog post?')) return;

    try {
      await api.delete(`/blogs/${id}`);
      setToast({ message: 'Blog post deleted successfully', type: 'success' });
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      setToast({ message: 'Failed to delete blog post', type: 'error' });
    }
  };

  const filteredBlogs = blogs.filter(
    (b) => b.title.toLowerCase().includes(search.toLowerCase()) || b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Blog Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage, draft, publish, and delete blog articles.</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </Link>
      </div>

      <div className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span>Loading articles...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-500">No blog posts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-dark-950/50 text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{blog.title}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                        {blog.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(blog)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          blog.isPublished
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {blog.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{blog.isPublished ? 'Published' : 'Draft'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        to={`/admin/blogs/edit/${blog._id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition-colors inline-block"
                        title="Edit Article"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Article"
                      >
                        <Trash2 className="w-4 h-4" />
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
  );
};

export default BlogManagementPage;