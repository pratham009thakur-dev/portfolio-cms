import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosClient';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Toast from '../components/common/Toast';
import {
  Github,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Code2,
  Database,
  Terminal,
  Cpu,
  Layers,
  Send,
  Loader2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const HomePage = () => {
  const [projects, setProjects] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, blogRes] = await Promise.all([
          api.get('/projects'),
          api.get('/blogs?includeUnpublished=false'),
        ]);
        setProjects(projRes.data.data || []);
        setRecentBlogs((blogRes.data.data || []).slice(0, 2));
      } catch (err) {
        console.error('Failed to load portfolio dynamic data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setToast({ message: 'Please complete all fields.', type: 'error' });
      return;
    }
    setFormLoading(true);
    try {
      await api.post('/contact', formData);
      setToast({ message: 'Your message has been sent successfully! I will reply soon.', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to send message. Please retry later.',
        type: 'error',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const skillsData = [
    {
      category: 'Frontend Engineering',
      icon: Layers,
      items: ['React.js', 'Vite', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML5 / Modern CSS', 'State Management'],
    },
    {
      category: 'Backend & Cloud',
      icon: Terminal,
      items: ['Node.js', 'Express.js', 'REST API Architecture', 'JWT Authentication', 'bcrypt Encryption', 'Microservices'],
    },
    {
      category: 'Databases & ORM',
      icon: Database,
      items: ['MongoDB Atlas', 'Mongoose ODM', 'Data Modeling', 'Indexing & Aggregations', 'Redis Caching'],
    },
    {
      category: 'Tooling & Deployment',
      icon: Cpu,
      items: ['Git & GitHub', 'Vercel Serverless', 'Postman API Testing', 'Docker Basics', 'npm / Vite ecosystem'],
    },
  ];

  const experienceData = [
    {
      role: 'Full-Stack Software Engineering Intern',
      company: 'Codec Technologies',
      duration: '2025 - Present',
      description:
        'Engineered responsive full-stack applications with MERN stack, implemented headless CMS dashboards, optimized Mongoose aggregation queries, and integrated secure JWT authentication pipelines.',
    },
    {
      role: 'Junior Frontend Developer',
      company: 'Digital Solutions Lab',
      duration: '2024 - 2025',
      description:
        'Developed interactive user portals, created reusable modular React component libraries, and improved mobile responsive performance by 35%.',
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section className="relative pt-20 pb-24 md:pt-32 md:pb-36 border-b border-slate-800/60 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Available for Full-Time Roles</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6">
                  Hi, I'm <span className="text-blue-500">Alex Rivera</span>.<br />
                  Full-Stack MERN Developer.
                </h1>
                <p className="text-lg text-slate-400 max-w-2xl mb-8 leading-relaxed mx-auto lg:mx-0">
                  Specialized in architecting high-performance web systems using React, Node.js, Express, and MongoDB. I turn complex logic into elegant, reliable digital experiences.
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <a
                    href="#contact"
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                  <a
                    href="#projects"
                    className="px-6 py-3 rounded-xl bg-dark-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-medium transition-all"
                  >
                    View Projects
                  </a>
                  <a
                    href="/resume-sample.pdf"
                    download="Alex_Rivera_Resume.pdf"
                    className="px-4 py-3 rounded-xl bg-dark-900 border border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white transition-all flex items-center gap-2 text-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Resume</span>
                  </a>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-5 text-slate-400">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="GitHub">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="mailto:alex.rivera.dev@example.com" className="hover:text-white transition-colors" aria-label="Email">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Profile Image Representation */}
              <div className="relative group">
                <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-2 border-slate-700/80 bg-dark-900 shadow-2xl relative z-10">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
                    alt="Alex Rivera Profile"
                    className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-all" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. About Section */}
        <section id="about" className="py-24 border-b border-slate-800/60 bg-dark-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">About Me</h2>
              <p className="text-3xl font-extrabold text-white">Engineering with curiosity, discipline, and clean code principles.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="space-y-5 text-slate-400 leading-relaxed">
                <p>
                  I am a passionate software engineer focused on building robust full-stack web applications. My core expertise revolves around the JavaScript ecosystem, spanning dynamic frontend interfaces with React to structured, secure server environments with Node.js and MongoDB.
                </p>
                <p>
                  As an intern at Codec Technologies, I specialize in architecting RESTful services, implementing scalable caching patterns, and standardizing authorization schemas using modern security best practices.
                </p>
                <p>
                  When not writing code, I author technical articles on cloud microservices, study distributed databases, and contribute to open-source developer tooling.
                </p>
              </div>

              <div className="bg-dark-900 border border-slate-800 p-8 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Education</h3>
                  <p className="text-slate-200 font-medium">B.S. in Computer Science & Information Systems</p>
                  <p className="text-xs text-slate-500 mt-1">State Technical University &bull; 2021 – 2025</p>
                </div>
                <div className="border-t border-slate-800 pt-6">
                  <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Primary Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Distributed Systems', 'Cloud Serverless', 'REST & GraphQL', 'Web Security', 'Database Indexing'].map((item) => (
                      <span key={item} className="px-3 py-1 rounded-md bg-slate-800/80 text-slate-300 text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Skills Section */}
        <section id="skills" className="py-24 border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Technical Stack</h2>
              <p className="text-3xl font-extrabold text-white">Technologies I leverage in production.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillsData.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.category}
                    className="bg-dark-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-4">{category.category}</h3>
                    <ul className="space-y-2.5">
                      {category.items.map((skill) => (
                        <li key={skill} className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. Projects Section */}
        <section id="projects" className="py-24 border-b border-slate-800/60 bg-dark-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Portfolio Projects</h2>
                <p className="text-3xl font-extrabold text-white">Featured work & applications.</p>
              </div>
              <p className="text-xs text-slate-500">Live dynamic records from MongoDB</p>
            </div>

            {loading ? (
              <div className="py-16 text-center text-slate-500 flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span>Fetching projects from database...</span>
              </div>
            ) : projects.length === 0 ? (
              <div className="py-16 text-center bg-dark-900 rounded-2xl border border-slate-800 text-slate-400">
                <p>No projects currently listed in database.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden flex flex-col group transition-all"
                  >
                    <div className="h-48 overflow-hidden bg-slate-800 relative">
                      <img
                        src={project.imageUrl || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {project.featured && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-xs font-semibold backdrop-blur-sm">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                          {project.title}
                        </h3>
                        <p className="text-slate-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.technologies.map((t) => (
                            <span key={t} className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-800 text-sm font-medium">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span>Source</span>
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors ml-auto"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 5. Experience Section */}
        <section id="experience" className="py-24 border-b border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-16">
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Work Experience</h2>
              <p className="text-3xl font-extrabold text-white">Professional timeline & responsibilities.</p>
            </div>
            <div className="space-y-8 max-w-3xl">
              {experienceData.map((exp, idx) => (
                <div key={idx} className="relative pl-8 border-l border-slate-800">
                  <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-blue-500" />
                  <div className="bg-dark-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h3 className="text-base font-bold text-white">{exp.role}</h3>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 w-fit">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-300 mb-3">{exp.company}</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Blogs Preview Section */}
        {recentBlogs.length > 0 && (
          <section className="py-20 border-b border-slate-800/60 bg-dark-950/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Technical Blog</h2>
                  <p className="text-2xl font-bold text-white">Recent Articles</p>
                </div>
                <Link to="/blogs" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                  <span>View All Articles</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {recentBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/blogs/${blog.slug}`}
                    className="group bg-dark-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-medium">
                          {blog.category}
                        </span>
                        <span>&bull;</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                    <span className="mt-4 text-xs font-semibold text-blue-400 group-hover:underline">
                      Read Article &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 6. Contact Section */}
        <section id="contact" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3">Contact</h2>
                <p className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Let's discuss opportunities.</p>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Have a question, an opportunity, or interested in collaborating on an innovative project? Send a message directly and I will get back to you promptly.
                </p>
                <div className="space-y-4 text-slate-300 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>alex.rivera.dev@example.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>github.com/alexrivera-dev</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="w-5 h-5 text-blue-400 shrink-0" />
                    <span>linkedin.com/in/alexrivera-dev</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Software Engineering Inquiry"
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Message Body</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;