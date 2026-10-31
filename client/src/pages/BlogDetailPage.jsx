import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosClient';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { Calendar, User, ArrowLeft, Tag, Clock, Share2, Loader2 } from 'lucide-react';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/blogs/${slug}`);
        setBlog(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Article could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm text-slate-400">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-2xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Post Not Found</h1>
          <p className="text-slate-400 mb-8">{error || 'The requested article does not exist or has been removed.'}</p>
          <Link
            to="/blogs"
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Articles</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>

          <header className="mb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 font-semibold uppercase tracking-wider">
                {blog.category}
              </span>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <span>&bull;</span>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{blog.author || 'Alex Rivera'}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              {blog.title}
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed font-normal italic border-l-2 border-blue-500 pl-4 py-1 mb-8">
              {blog.excerpt}
            </p>

            <div className="rounded-3xl overflow-hidden border border-slate-800 max-h-96 w-full">
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Formatted Content */}
          <div className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed space-y-6">
            {blog.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={index} className="text-2xl font-bold text-white pt-4 mb-2">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={index} className="text-3xl font-bold text-white pt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              return (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>

          {/* Tags Footer */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-800 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-slate-500 mr-2" />
              {blog.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-dark-900 border border-slate-800 text-xs text-slate-300">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default BlogDetailPage;