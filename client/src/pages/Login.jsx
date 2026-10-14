import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // تفعيل أيقونات Lucide إيلا كانت مخدومة بالـ script أو packages
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [showPassword]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // الاتصال بالباك إند الحقيقي (كيقبل الإيميل، النمرة، أو الـ idUnique في identifier)
      const response = await API.post('/auth/login', {
        identifier: identifier.trim(),
        password: password
      });



      if (response.data.success) {
        const userData = response.data.data;
        
        // حفظ المستخدم والـ Token في localStorage
        localStorage.setItem('token', userData.token);
        localStorage.setItem('currentUser', JSON.stringify(userData));

        const displayName = (userData.fullNameAr && userData.fullNameAr.trim() !== '') 
          ? userData.fullNameAr 
          : userData.fullName;

        Swal.fire({
          icon: 'success',
          title: 'مرحباً!',
          text: `مرحباً بك مجدداً يا ${displayName} 👋`,
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          // يمكن تحويله للصفحة الرئيسية لاحقاً
          // window.location.href = '/dashboard';
          navigate('/dashboard');
        });
      }
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      const errorMsg = error.response?.data?.message || 'بيانات الدخول غير صحيحة، حاول مجدداً.';
      
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: errorMsg,
        confirmButtonColor: '#2D5A27'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 font-arabic" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#EAF0EC] overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-b from-[#EAF0EC] to-[#FDFBF7] pt-7 pb-4 px-6 text-center border-b border-gray-50">
          <div className="w-14 h-14 mx-auto mb-2 bg-white/80 backdrop-blur rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
            <svg className="w-7 h-7 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2D5A27]">ربيع قلوبنا</h1>
          <p className="text-xs text-[#B38F36] font-semibold mt-0.5">مرحباً بك مجدداً</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-5 space-y-3.5">
          
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">البريد، الهاتف أو المعرف (ID)</label>
            <div className="relative">
              <input 
                type="text" 
                required 
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="example@mail.com أو RQ-88241" 
                className="w-full p-3 pr-4 pl-10 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59] transition-all" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">كلمة السر</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-3 pr-4 pl-10 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59] transition-all" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute left-3 top-3.5 text-xs font-bold text-[#4A7C59] cursor-pointer"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          <div className="text-left">
            <a href="/forgot-password" className="text-xs text-[#B38F36] hover:underline font-semibold">نسيت كلمة السر؟</a>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#4A7C59] hover:bg-[#2D5A27] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-1 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Footer Link */}
        <div className="p-4 text-center border-t border-gray-100 bg-[#FDFBF7]/60">
          <p className="text-xs text-gray-500">
            ليس لديك حساب بعد؟
            <a href="/signup" className="mr-1 text-[#4A7C59] font-bold hover:underline">إنشاء حساب جديد</a>
          </p>
        </div>
      </div>
    </div>
  );
}