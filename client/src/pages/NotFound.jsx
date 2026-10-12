import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4 font-arabic text-center" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#EAF0EC] p-8">
        <h1 className="text-6xl font-bold text-[#2D5A27] mb-2">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">الصفحة غير موجودة!</h2>
        <p className="text-sm text-gray-500 mb-6">
          عذراً، الصفحة التي تحاول الوصول إليها غير موجودة أو تم نقلها.
        </p>
        <Link 
          to="/login" 
          className="inline-block px-6 py-3 bg-[#4A7C59] hover:bg-[#2D5A27] text-white font-bold rounded-xl shadow-md transition-all text-sm"
        >
          العودة لتسجيل الدخول
        </Link>
      </div>
    </div>
  );
}