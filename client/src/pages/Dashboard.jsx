import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    Swal.fire({
      icon: 'info',
      title: 'تم تسجيل الخروج',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      navigate('/login');
    });
  };

  const displayName = currentUser.fullNameAr || currentUser.fullName || 'المستخدم';

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-arabic p-6" dir="rtl">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-lg border border-[#EAF0EC] p-6">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2D5A27]">ربيع القلوب - لوحة التحكم</h1>
            <p className="text-sm text-[#B38F36]">مرحباً بك، {displayName} 👋</p>
          </div>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold transition-all cursor-pointer"
          >
            تسجيل الخروج
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#FDFBF7] border border-gray-100 rounded-2xl">
            <h2 className="font-bold text-[#2D5A27] mb-2">معلومات الحساب:</h2>
            <p className="text-sm text-gray-700"><strong>المعرف الفريد (ID):</strong> {currentUser.idUnique || 'غير متوفر'}</p>
            <p className="text-sm text-gray-700"><strong>البريد الإلكتروني:</strong> {currentUser.mail || 'غير محدد'}</p>
            <p className="text-sm text-gray-700"><strong>رقم الهاتف:</strong> {currentUser.phone || 'غير محدد'}</p>
            <p className="text-sm text-gray-700"><strong>البلد:</strong> {currentUser.country || 'المغرب'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}