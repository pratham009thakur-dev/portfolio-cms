import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Search, Tag, Calendar, User, ArrowRight, Loader2, BookOpen } from 'lucide-react';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      let url = '/blogs?includeUnpublished=false';
      if (selectedCategory !== 'All') {
        url += `&category=${encodeURIComponent(selectedCategory)}`;
      }
      const res = await api.get(url);
      const data = res.data.data || [];
      setBlogs(data);

      // Extract unique categories
      const distinct = ['All', ...new Set(data.map((b) => b.category).filter(Boolean))];
      setCategories((prev) => (prev.length <= 1 ? distinct : prev));
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    return blogs.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.excerpt.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query))
    );
  };

  const filteredBlogs = blogs.filter((blog) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.excerpt.toLowerCase().includes(query) ||
      blog.tags.some((t) => t.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">Engineering Blog</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              In-depth articles covering MERN stack architecture, backend reliability, modern frontend styling, and production web deployment.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </form>
          </div>

          {/* Articles Listing */}
          {loading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm">Fetching published posts from MongoDB...</p>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-24 text-center bg-dark-900 rounded-3xl border border-slate-800 p-8">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
              <p className="text-sm text-slate-400">
                Try searching for another keyword or change your category filter.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post) => (
                <article
                  key={post._id}
                  className="bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col group transition-all"
                >
                  <div className="h-48 overflow-hidden bg-slate-800">
                    <img
                      src={post.coverImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                          {post.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 leading-snug">
                        <Link to={`/blogs/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed mb-6">
                        {post.excerpt}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {post.tags.map((tag) => (
                          <span key={tag} className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={`/blogs/${post.slug}`}
                        className="flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        <span>Read Full Post</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogsPage;