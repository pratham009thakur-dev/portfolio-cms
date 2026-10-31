import React from 'react';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-dark-950 py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Alex Rivera. Codec Technologies Full-Stack Internship Capstone.
          </p>
          <p className="text-xs text-slate-600 mt-1">Built with MongoDB Atlas, Express, React, Node.js & Tailwind CSS.</p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:alex.rivera.dev@example.com"
            className="hover:text-blue-400 transition-colors"
            aria-label="Email Alex"
          >
            <Mail className="w-5 h-5" />
          </a>
          <Link to="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
            CMS Login
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;