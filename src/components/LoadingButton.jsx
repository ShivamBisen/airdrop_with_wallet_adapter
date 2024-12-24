import React from 'react';

const LoadingButton = ({ 
    onClick, 
    loading, 
    disabled, 
    children, 
    className = "",
    type = "button"
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`relative w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium
                transition-all duration-200 hover:scale-105 active:scale-95
                disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed
                ${className}`}
        >
            {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <svg 
                        className="animate-spin h-5 w-5 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                    >
                        <circle 
                            className="opacity-25" 
                            cx="12" 
                            cy="12" 
                            r="10" 
                            stroke="currentColor" 
                            strokeWidth="4"
                        />
                        <path 
                            className="opacity-75" 
                            fill="currentColor" 
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </div>
            ) : null}
            <span className={loading ? "invisible" : ""}>{children}</span>
        </button>
    );
};

export default LoadingButton; 