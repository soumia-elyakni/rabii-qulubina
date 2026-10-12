import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import CustomInput from '../components/CustomInput';

// قائمة احتياطية مضمونة 100%
const FALLBACK_COUNTRIES = [
  { name: "المغرب", code: "+212", flag: "🇲🇦" },
  { name: "السعودية", code: "+966", flag: "🇸🇦" },
  { name: "مصر", code: "+20", flag: "🇪🇬" },
  { name: "الجزائر", code: "+213", flag: "🇩🇿" },
  { name: "تونس", code: "+216", flag: "🇹🇳" },
  { name: "الإمارات العربية المتحدة", code: "+971", flag: "🇦🇪" },
  { name: "قطر", code: "+974", flag: "🇶🇦" },
  { name: "الكويت", code: "+965", flag: "🇰🇼" },
  { name: "تركيا", code: "+90", flag: "🇹🇷" },
  { name: "فرنسا", code: "+33", flag: "🇫🇷" },
  { name: "إسبانيا", code: "+34", flag: "🇪🇸" },
  { name: "ألمانيا", code: "+49", flag: "🇩🇪" },
  { name: "المملكة المتحدة", code: "+44", flag: "🇬🇧" },
  { name: "الولايات المتحدة", code: "+1", flag: "🇺🇸" }
];

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [countriesList, setCountriesList] = useState(FALLBACK_COUNTRIES);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullNameInput: '',
    mail: '',
    phoneCode: '+212',
    phoneNumber: '',
    password: '',
    country: 'المغرب'
  });

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all?fields=name,cca2,idd,flag,translations')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          const formatted = res.data
            .filter(c => c.cca2 !== 'IL' && c.name?.common !== 'Israel')
            .map(c => {
              const root = c.idd?.root || '';
              const suffixes = c.idd?.suffixes || [];
              const code = (suffixes.length === 1) ? `${root}${suffixes[0]}` : root;
              
              return {
                name: c.translations?.ara?.common || c.name?.common || '',
                code: code || '',
                flag: c.flag || '🏳️'
              };
            })
            .filter(c => c.name !== '' && c.code !== '')
            .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

          if (formatted.length > 0) setCountriesList(formatted);
        }
      })
      .catch(err => console.warn("استخدام قائمة الدول الاحتياطية", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      const selectedC = countriesList.find(c => c.name === value);
      setFormData(prev => ({
        ...prev,
        country: value,
        phoneCode: selectedC ? selectedC.code : prev.phoneCode
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const cleanedMail = formData.mail.trim();
    const cleanedPhoneNum = formData.phoneNumber.trim();

    if (!cleanedMail && !cleanedPhoneNum) {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى إدخال البريد الإلكتروني أو رقم الهاتف على الأقل للتسجيل.',
        confirmButtonColor: '#2D5A27'
      });
      return;
    }

    const fullPhone = cleanedPhoneNum ? `${formData.phoneCode}${cleanedPhoneNum}` : '';
    setLoading(true);

    try {
      const response = await API.post('/auth/register', {
        nameInput: formData.fullNameInput,
        mail: cleanedMail,
        phone: fullPhone,
        password: formData.password,
        country: formData.country
      });

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'تم إنشاء الحساب بنجاح! 🎉',
          text: `المعرف الخاص بك هو: ${response.data.data.idUnique}`,
          confirmButtonColor: '#2D5A27'
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      console.error("خطأ أثناء التسجيل:", error);
      const msg = error.response?.data?.message || "حدث خطأ في الخادم الداخلي";
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
          <p className="text-xs text-[#B38F36] font-semibold mt-0.5">إنشاء حساب جديد</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSignup} className="p-5 space-y-3">
          
          <CustomInput 
            label="الاسم الكامل *"
            name="fullNameInput"
            value={formData.fullNameInput}
            onChange={handleChange}
            required={true}
            placeholder="مثال: سمية اليقني"
          />

          <CustomInput 
            label="البريد الإلكتروني"
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
            placeholder="example@mail.com"
          />

          {/* اختيار الدولة */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">البلد *</label>
            <select 
              name="country" 
              value={formData.country} 
              onChange={handleChange} 
              required 
              className="w-full p-2.5 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59] cursor-pointer"
            >
              {countriesList.map((c, idx) => (
                <option key={idx} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* كود الهاتف والرقم */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600 block text-right">
              رقم الهاتف <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <div className="flex space-x-2 space-x-reverse" dir="ltr">
              <select 
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
                className="bg-[#FDFBF7] border border-gray-200 rounded-xl px-2 text-xs text-gray-700 outline-none focus:border-[#4A7C59] max-w-[110px] cursor-pointer"
              >
                {countriesList.map((c, idx) => (
                  <option key={idx} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>

              <input 
                type="tel" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="600000000" 
                className="w-full p-2.5 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59]" 
              />
            </div>
          </div>

          <CustomInput 
            label="كلمة السر *"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={true}
            placeholder="••••••••"
            icon={<span className="text-xs text-gray-500">{showPassword ? "إخفاء" : "إظهار"}</span>}
            onIconClick={() => setShowPassword(!showPassword)}
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-[#4A7C59] hover:bg-[#2D5A27] text-white font-bold rounded-xl shadow-md transition-all text-sm mt-1 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'جاري التسجيل...' : 'إنشاء الحساب'}
          </button>
        </form>

        {/* Footer Link للعودة لصفحة تسجيل الدخول */}
        <div className="p-4 text-center border-t border-gray-100 bg-[#FDFBF7]/60">
          <p className="text-xs text-gray-500">
            لديك حساب بالفعل؟
            <Link to="/login" className="mr-1 text-[#4A7C59] font-bold hover:underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}