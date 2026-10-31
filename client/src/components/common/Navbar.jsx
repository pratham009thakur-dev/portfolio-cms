import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Menu, X, Terminal, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-dark-950/80 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:border-blue-500/50 transition-colors">
            <Terminal className="w-5 h-5" />
          </div>
          <span className="font-bold tracking-tight text-lg text-slate-100 group-hover:text-blue-400 transition-colors">
            Alex.dev<span className="text-blue-500 font-mono">_</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {isHome ? (
            <>
              <a href="#about" className="hover:text-blue-400 transition-colors">About</a>
              <a href="#skills" className="hover:text-blue-400 transition-colors">Skills</a>
              <a href="#projects" className="hover:text-blue-400 transition-colors">Projects</a>
              <a href="#experience" className="hover:text-blue-400 transition-colors">Experience</a>
              <a href="#contact" className="hover:text-blue-400 transition-colors">Contact</a>
            </>
          ) : (
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          )}
          <Link to="/blogs" className="hover:text-blue-400 transition-colors">Articles & Blog</Link>
          
          {isAuthenticated ? (
            <Link
              to="/admin/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <Shield className="w-4 h-4" />
              <span>Admin CMS</span>
            </Link>
          ) : (
            <Link
              to="/admin/login"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Portal
            </Link>
          )}
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-slate-800 px-4 pt-3 pb-6 flex flex-col gap-4 text-base font-medium">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Home</Link>
          <Link to="/blogs" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-400">Blog</Link>
          {isAuthenticated ? (
            <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-blue-400">
              Admin CMS
            </Link>
          ) : (
            <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">
              Admin Portal
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;