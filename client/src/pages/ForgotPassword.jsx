import React, { useState } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [mail, setMail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post('/auth/forgot-password', { mail: mail.trim() });
      if (response.data.success) {
        // الانتقال مباشرة بدون SweetAlert
        navigate('/reset-password', { state: { email: mail.trim() } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'حدث خطأ ما، حاول مجدداً.';
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
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#EAF0EC] overflow-hidden">
        
        <div className="bg-gradient-to-b from-[#EAF0EC] to-[#FDFBF7] pt-6 pb-4 px-6 text-center border-b border-gray-50">
          <h1 className="text-2xl font-bold text-[#2D5A27]">ربيع القلوب</h1>
          <p className="text-xs text-[#B38F36] font-semibold mt-0.5">استعادة كلمة السر</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">البريد الإلكتروني الخاص بك *</label>
            <input 
              type="email" 
              required 
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              placeholder="example@mail.com" 
              className="w-full p-3 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59]" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#4A7C59] hover:bg-[#2D5A27] text-white font-bold rounded-xl shadow-md transition-all text-sm disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
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