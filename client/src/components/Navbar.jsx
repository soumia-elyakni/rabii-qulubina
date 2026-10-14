import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, BookOpen, Users, Bell, Settings, LogOut } from 'lucide-react';
import Swal from 'sweetalert2';

export default function Navbar({ activePage = 'home', user = null }) {
  const navigate = useNavigate();

  // جلب بيانات المستخدم من Props أو LocalStorage
  const storedUser = user || JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  const displayName = (storedUser?.fullNameAr && storedUser.fullNameAr.trim() !== '') 
    ? storedUser.fullNameAr 
    : (storedUser?.fullName || storedUser?.fullNameInput || "المستخدم");

  const rawId = storedUser?.idUnique || "RQ-00000";
  const formattedId = rawId.startsWith('#') ? rawId : `#${rawId}`;

  // دالة تسجيل الخروج
  const handleLogout = () => {
    Swal.fire({
      title: 'تسجيل الخروج',
      text: 'هل تريد تسجيل الخروج؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'موافق',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#2D5A27',
      cancelButtonColor: '#9CA3AF',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-3xl p-6 font-arabic shadow-xl border border-gray-100',
        title: 'text-lg font-bold text-gray-800',
        confirmButton: 'rounded-xl px-5 py-2.5 text-xs font-bold shadow-none',
        cancelButton: 'rounded-xl px-5 py-2.5 text-xs font-bold shadow-none'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        navigate('/login');
      }
    });
  };

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, href: '/dashboard' },
    { id: 'programs', label: 'البرامج', icon: BookOpen, href: '/programs' },
    { id: 'friends', label: 'المتنافسون', icon: Users, href: '/friends' },
    { id: 'notifications', label: 'التنبيهات', icon: Bell, href: '/notifications' },
    { id: 'settings', label: 'الإعدادات', icon: Settings, href: '/settings' },
  ];

  return (
    <>
      {/* 🖥️ Header العريض + Navigation للويب */}
      <header className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-[#EAF0EC] mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 rounded-2xl bg-[#EAF0EC] text-[#2D5A27] flex items-center justify-center font-bold text-xl border border-emerald-100 shadow-sm">
            <BookOpen className="w-6 h-6 text-[#2D5A27]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold text-[#2D5A27]">{displayName}</h1>
              <span className="bg-amber-100 text-amber-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {formattedId}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">تقبل الله طاعتك 🤲✨</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 💻 القائمة العلوية للبيسي */}
          <nav className="hidden md:flex items-center space-x-1 space-x-reverse bg-[#FDFBF7] p-1.5 rounded-xl border border-gray-200">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#2D5A27] text-white shadow-sm'
                      : 'text-gray-600 hover:text-[#2D5A27]'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* 🔴 Bouton Logout */}
          <button
            onClick={handleLogout}
            title="تسجيل الخروج"
            className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all flex items-center justify-center border border-red-100 shadow-sm cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 📱 الشريط السفلي للموبايل فقط */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#EAF0EC] p-2 flex justify-around items-center md:hidden z-50 shadow-lg">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`flex flex-col items-center transition-all ${
                isActive ? 'text-[#2D5A27] font-bold' : 'text-gray-400 hover:text-[#2D5A27]'
              }`}
            >
              <IconComponent className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}