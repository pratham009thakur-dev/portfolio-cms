import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axiosClient';
import Toast from '../../components/common/Toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const BlogEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Backend',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: '',
    isPublished: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    if (isEditing) {
      const fetchBlog = async () => {
        try {
          const res = await api.get(`/blogs/${id}`);
          const blog = res.data.data;
          setFormData({
            title: blog.title || '',
            category: blog.category || 'Backend',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            coverImage: blog.coverImage || '',
            tags: blog.tags ? blog.tags.join(', ') : '',
            isPublished: Boolean(blog.isPublished),
          });
        } catch {
          setToast({ message: 'Error fetching blog details', type: 'error' });
        } finally {
          setFetchLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (isEditing) {
        await api.put(`/blogs/${id}`, payload);
      } else {
        await api.post('/blogs', payload);
      }

      navigate('/admin/blogs');
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Error saving blog post',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm">Loading article editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="flex items-center justify-between">
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
        <h1 className="text-xl font-bold text-white">{isEditing ? 'Edit Blog Post' : 'Create New Post'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-900 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6">
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Article Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Scaling Microservices with Node and Redis"
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Category</label>
            <input
              type="text"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Backend, Frontend, Cloud"
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Cover Image URL</label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Short Excerpt (Summary)</label>
          <textarea
            required
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="A short teaser summary of the post..."
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
            Full Markdown / Article Content
          </label>
          <textarea
            required
            rows={12}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            placeholder="Write full article here. Use '### Header' for sections and blank lines for paragraphs."
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">Tags (Comma-Separated)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Node.js, Express, MongoDB, Architecture"
            className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-dark-950 border-slate-700"
          />
          <label htmlFor="isPublished" className="text-sm font-medium text-slate-300">
            Publish immediately (visible to the public)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm transition-colors flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Article...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save & Publish Post</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BlogEditorPage;