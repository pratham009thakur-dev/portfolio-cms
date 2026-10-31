import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogsPage from './pages/BlogsPage';
import BlogDetailPage from './pages/BlogDetailPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import AdminLayout from './components/dashboard/AdminLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardOverviewPage from './pages/admin/DashboardOverviewPage';
import BlogManagementPage from './pages/admin/BlogManagementPage';
import BlogEditorPage from './pages/admin/BlogEditorPage';
import ProjectManagementPage from './pages/admin/ProjectManagementPage';
import MessageManagementPage from './pages/admin/MessageManagementPage';

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:slug" element={<BlogDetailPage />} />
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Protected Admin Console */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardOverviewPage />} />
          <Route path="blogs" element={<BlogManagementPage />} />
          <Route path="blogs/new" element={<BlogEditorPage />} />
          <Route path="blogs/edit/:id" element={<BlogEditorPage />} />
          <Route path="projects" element={<ProjectManagementPage />} />
          <Route path="messages" element={<MessageManagementPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;