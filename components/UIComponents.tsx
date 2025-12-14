import React from 'react';
import { motion } from 'framer-motion';

// --- Types ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

// --- Components ---

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-3.5 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-[#5A4BFF] to-[#33CFFF] text-white shadow-lg shadow-indigo-500/30",
    secondary: "bg-[#FFC748] text-[#111118] shadow-lg shadow-yellow-500/20",
    outline: "border-2 border-[#5A4BFF] text-[#5A4BFF] dark:text-white dark:border-white/20",
    ghost: "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5",
  };

  return (
    <motion.button 
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-1">{label}</label>}
      <div className="relative">
        <input 
          className="w-full bg-white dark:bg-[#1E1E24] border border-gray-100 dark:border-white/10 rounded-2xl py-3.5 px-4 pl-11 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#5A4BFF] focus:outline-none transition-all shadow-sm"
          {...props} 
        />
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean; onClick?: () => void }> = ({ 
  children, 
  className = '', 
  noPadding = false,
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-[#1E1E24] rounded-3xl shadow-soft dark:shadow-none border border-gray-100 dark:border-white/5 ${noPadding ? '' : 'p-5'} ${className}`}
    >
      {children}
    </div>
  );
};

export const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  isActive: boolean; 
  onClick: () => void 
}> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#5A4BFF] dark:text-[#33CFFF]' : 'text-gray-400 dark:text-gray-500'}`}
  >
    <div className={isActive ? "scale-110 transition-transform" : ""}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);