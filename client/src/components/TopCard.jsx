import React from 'react';

export default function TopCard({ title, subtitle, icon: Icon, iconBg = 'bg-emerald-50 text-emerald-600', onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white p-4 rounded-2xl border border-[#EAF0EC] shadow-sm flex items-center justify-between ${
        onClick ? 'cursor-pointer hover:border-emerald-200 transition-all' : ''
      }`}
    >
      <div>
        <span className="text-xl md:text-2xl font-bold text-gray-800">{title}</span>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
}