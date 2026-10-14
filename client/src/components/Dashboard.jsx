import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Flame, BookOpen, Trophy, Bell } from 'lucide-react';
import AyaCard from './AyaCard';
import TopCard from './TopCard';

export default function Dashboard() {
  const { currentUser } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* بطاقة آية التذكير */}
      <AyaCard />

      {/* 📊 البطاقات الأربع: 2 بـ 2 في التلفون، و 4 في سطر واحد (1 1 1 1) في الـ Web */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        {/* 1. Streak */}
        <TopCard 
          title="12 يوم" 
          subtitle="التزام متواصل 🔥" 
          icon={Flame} 
          iconBg="bg-orange-50 text-orange-600" 
        />

        {/* 2. Active Programs */}
        <TopCard 
          title="4 برامج" 
          subtitle="نشطة حالياً 📖" 
          icon={BookOpen} 
          iconBg="bg-blue-50 text-blue-600" 
        />

        {/* 3. Hasilat Lhifz */}
        <TopCard 
          title="7 أحزاب" 
          subtitle="حصيلة الحفظ 🏆" 
          icon={Trophy} 
          iconBg="bg-amber-50 text-amber-600"
          onClick={() => {
            alert('قريباً: تفاصيل حصيلة الحفظ وطريقة حسابها');
          }}
        />

        {/* 4. Tadkir */}
        <TopCard 
          title="سورة الكهف" 
          subtitle="تذكير اليوم (الجمعة) 🔔" 
          icon={Bell} 
          iconBg="bg-emerald-50 text-emerald-600" 
        />

      </div>
    </div> 
  );
}