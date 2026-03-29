import React, { useEffect, useState, useRef } from "react";
import { HiChevronDown } from "react-icons/hi2";

const CustomDropdown = ({ label, value, options, onChange, name, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={`space-y-1 relative ${className}`} ref={dropdownRef}>
      {label && <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border border-transparent focus:ring-2 focus:ring-[#5A45FF]/50 transition font-bold flex items-center justify-between cursor-pointer hover:shadow-sm group"
      >
        <span className={`text-sm ${selectedOption ? "" : "text-gray-400"}`}>
          {selectedOption ? selectedOption.label : "Select..."}
        </span>
        <HiChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-400 group-hover:text-[#5A45FF] h-4 w-4`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full min-w-[160px] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
          {options.map((opt) => (
            <div 
              key={opt.value}
              onClick={() => {
                onChange({ target: { name, value: opt.value } });
                setIsOpen(false);
              }}
              className={`px-4 py-2.5 rounded-xl cursor-pointer font-bold text-xs transition-all mb-1 last:mb-0 ${String(value) === String(opt.value) ? 'bg-[#5A45FF] text-white shadow-lg shadow-[#5A45FF]/20' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
