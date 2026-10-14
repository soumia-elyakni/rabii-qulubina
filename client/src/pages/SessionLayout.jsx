import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function SessionLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. التثبت من وجود المستخدم والـ Session
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      setCurrentUser(JSON.parse(storedUser));
    } catch (e) {
      console.error("Error parsing user session:", e);
      localStorage.removeItem('currentUser');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center font-arabic text-[#2D5A27]">
        جاري التحميل...
      </div>
    );
  }

  // معرفة الصفحة الحالية تلقائياً من الـ URL
  const getActivePage = () => {
    const path = location.pathname;
    if (path.includes('/programs')) return 'programs';
    if (path.includes('/friends')) return 'friends';
    if (path.includes('/notifications')) return 'notifications';
    if (path.includes('/settings')) return 'settings';
    return 'home'; // default dashboard
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-arabic pb-20 md:pb-10" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 py-4 md:py-8">
        
        {/* Navbar كينزل هنا أوتوماتيكياً لكل الصفحات */}
        <Navbar activePage={getActivePage()} user={currentUser} />

        {/* المحتوى الديناميكي للصفحات (Dashboard, Programs, etc.) */}
        <main>
          <Outlet context={{ currentUser }} />
        </main>

      </div>
    </div>
  );
}