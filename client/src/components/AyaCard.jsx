import React from 'react';

export default function AyaCard() {
  return (
    <div className="relative bg-gradient-to-r from-[#2D5A27] to-[#4A7C59] text-white p-6 md:p-8 rounded-3xl shadow-md mb-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      <div className="relative z-10 text-center space-y-2">
        <span className="inline-block bg-amber-400/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-300/30">
          تذكير اليوم
        </span>
        <h2 className="text-xl md:text-2xl font-bold font-arabic leading-relaxed">
          "اللَّهُمَّ اجْعَلِ الْقُرْآنَ رَبِيعَ قُلُوبِنَا"
        </h2>
        <p className="text-xs text-emerald-100 opacity-90">«اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ»</p>
      </div>
    </div>
  );
}