import React, { useState, useEffect } from 'react';
import api from '../../api/axiosClient';
import Toast from '../../components/common/Toast';
import { Plus, Edit2, Trash2, Loader2, Save, X } from 'lucide-react';

const ProjectManagementPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Form Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data || []);
    } catch {
      setToast({ message: 'Error retrieving projects', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingId(project._id);
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies.join(', '),
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        imageUrl: project.imageUrl || '',
        featured: Boolean(project.featured),
        order: project.order || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        description: '',
        technologies: '',
        githubUrl: '',
        liveUrl: '',
        imageUrl: '',
        featured: false,
        order: 0,
      });
    }
    setShowModal(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
        setToast({ message: 'Project updated successfully!', type: 'success' });
      } else {
        await api.post('/projects', payload);
        setToast({ message: 'Project created successfully!', type: 'success' });
      }

      setShowModal(false);
      loadProjects();
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Failed to save project', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project permanently?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setToast({ message: 'Project removed', type: 'success' });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setToast({ message: 'Failed to delete project', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Project Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage dynamic portfolio projects shown on the homepage.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center flex items-center justify-center gap-2 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          <span>Fetching projects...</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-dark-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base truncate">{proj.title}</h3>
                  {proj.featured && (
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-semibold">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 line-clamp-3 mb-4">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {proj.technologies.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleOpenModal(proj)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(proj._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">
                  Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  placeholder="React, Express, MongoDB, Tailwind"
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Live Demo URL</label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-700 text-white text-sm"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-dark-950 border-slate-700"
                />
                <label htmlFor="featured" className="text-sm font-medium text-slate-300">
                  Highlight as Featured Project
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagementPage;