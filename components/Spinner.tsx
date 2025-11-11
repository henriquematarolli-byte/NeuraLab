
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', text }) => {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16'
    };
    return (
        <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
            <div className={`animate-spin rounded-full ${sizeClasses[size]} border-b-2 border-t-2 border-indigo-500`}></div>
            {text && <p className="text-lg">{text}</p>}
        </div>
    );
}

export default Spinner;
