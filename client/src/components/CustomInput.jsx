import React from 'react';

export default function CustomInput({ label, type = "text", name, value, onChange, placeholder, required = false, icon, onIconClick }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-semibold text-gray-600 block text-right">{label}</label>
      <div className="relative">
        <input 
          type={type} 
          name={name} 
          value={value} 
          onChange={onChange} 
          required={required} 
          placeholder={placeholder} 
          className="w-full p-2.5 text-sm bg-[#FDFBF7] border border-gray-200 rounded-xl text-right outline-none focus:border-[#4A7C59]" 
        />
        {icon && (
          <button type="button" onClick={onIconClick} className="absolute left-3 top-3 text-gray-400">
            {icon}
          </button>
        )}
      </div>
    </div>
  );
}