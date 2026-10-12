import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import API from '../api/axios';
import Swal from 'sweetalert2';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // جلب الإيميل اللي داز من صفحة ForgotPassword عبر الـ state
  const email = location.state?.email || '';

  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!code.trim() || !newPassword.trim()) return;

    setLoading(true);
    try {
      const response = await API.post('/auth/reset-password', {
        mail: email,
        code: code.trim(),
        newPassword: newPassword
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم تغيير كلمة المرور! 🎉',
          text: response.data.message || 'يمكنك الآن تسجيل الدخول.',
          confirmButtonColor: '#2D5A27'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'الرمز غير صحيح أو انتهت صلاحيته';
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: msg,
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
        <div className="bg-gradient-to-b from-[#EAF0EC] to-[#FDFBF7] pt-6 pb-4 px-6 text-center border-b border-gray-50">
          <h1 className="text-2xl font-bold text-[#2D5A27]">ربيع القلوب</h1>
          <p className="text-xs text-[#B38F36] font-semibold mt-0.5">إعادة تعيين كلمة المرور</p>
        </div>

        {/* Form */}
        <form onSubmit={handleResetPassword} className="p-5 space-y-4">
          
          {/* تنبيه واضح للإيميل ومدة الصلاحية */}
          <div className="bg-[#EAF0EC]/60 border border-[#4A7C59]/20 rounded-2xl p-3.5 text-center space-y-1">
            <p className="text-xs text-gray-700 leading-relaxed">
              تم إرسال رمز التحقق إلى بريدك الإلكتروني: <br />
              <span className="font-bold text-[#2D5A27] text-sm dir-ltr inline-block mt-0.5">{email || 'البريد الإلكتروني'}</span>
            </p>
            <p className="text-[11px] text-[#B38F36] font-semibold">
              ⏱️ يرجى إدخال الرمز خلال 15 دقيقة قبل انتهاء صلاحيته.
            </p>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">رمز التحقق (6 أرقام) *</label>
            <input 
              type="text" 
              required 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456" 
              className="w-full p-3 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59]" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">كلمة المرور الجديدة *</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-3 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59]" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-xs text-gray-500 font-semibold cursor-pointer"
              >
                {showPassword ? "إخفاء" : "إظهار"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#4A7C59] hover:bg-[#2D5A27] text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'جاري التحديث...' : 'حفظ كلمة المرور الجديدة'}
          </button>
        </form>

        <div className="p-4 text-center border-t border-gray-100 bg-[#FDFBF7]/60">
          <Link to="/login" className="text-xs text-[#4A7C59] font-bold hover:underline">
            العودة لتسجيل الدخول
          </Link>
        </div>

      </div>
    </div>
  );
}