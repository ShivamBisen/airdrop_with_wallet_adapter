import React, { useState } from 'react';

const TokenSearch = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        onSearch(value);
    };

    return (
        <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg bg-gray-700 
                    text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
                    transition-colors"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={handleSearch}
            />
        </div>
    );
};

export default TokenSearch; 