import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import SessionLayout from './pages/SessionLayout';

// مكون لحماية المسارات المشروطة (Protected Routes)
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* الصفحة الافتراضية كتحول المباشر لـ Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* المسارات العامة (Public Routes) */}
        {/* (دابا غتزيدي داك useEffect غير في Login, Signup, ForgotPassword, ResetPassword باش إيلا كانت السشن محلولة يرجعو لـ dashboard) */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/* المسار المحمي (Protected Dashboard) */}

        <Route element={<SessionLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* صفحة 404 لأي مسار غير معروف */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}