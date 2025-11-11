
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`bg-slate-800 border border-slate-700 rounded-lg shadow-lg p-6 ${className} ${onClick ? 'cursor-pointer hover:border-indigo-500 transition-colors' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
