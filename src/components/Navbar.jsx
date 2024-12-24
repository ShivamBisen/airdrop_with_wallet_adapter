import React, { useState, useEffect } from 'react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';

const Navbar = ({ activeTab, setActiveTab }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const tabs = ['Balance', 'Airdrop', 'SendTransaction', 'Swap'];

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 border-b border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Navbar Content */}
                <div className={`flex justify-between items-center transition-all duration-300 ${
                    isScrolled ? 'h-16' : 'h-20'
                }`}>
                    {/* Logo and Title */}
                    <div className="flex items-center gap-3">
                        <div className={`transition-all duration-300 bg-blue-500 rounded-lg flex items-center justify-center ${
                            isScrolled ? 'w-8 h-8' : 'w-10 h-10'
                        }`}>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="currentColor" 
                                className={`transition-all duration-300 ${
                                    isScrolled ? 'w-5 h-5' : 'w-6 h-6'
                                }`}
                            >
                                <path d="M2.273 5.625A4.483 4.483 0 015.25 4.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 3H5.25a3 3 0 00-2.977 2.625zM2.273 8.625A4.483 4.483 0 015.25 7.5h13.5c1.141 0 2.183.425 2.977 1.125A3 3 0 0018.75 6H5.25a3 3 0 00-2.977 2.625zM5.25 9a3 3 0 00-3 3v6a3 3 0 003 3h13.5a3 3 0 003-3v-6a3 3 0 00-3-3H15a.75.75 0 00-.75.75 2.25 2.25 0 01-4.5 0A.75.75 0 009 9H5.25z" />
                            </svg>
                        </div>
                        <h1 className={`font-bold transition-all duration-300 hidden sm:block ${
                            isScrolled ? 'text-lg' : 'text-xl'
                        }`}>
                            Solana Dashboard
                        </h1>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="sm:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>

                    {/* Wallet Buttons - Hidden on Mobile */}
                    <div className="hidden sm:flex items-center gap-4">
                        <WalletMultiButton className={`transition-all duration-300 rounded-lg hover:scale-105 ${
                            isScrolled ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'
                        }`} />
                        <WalletDisconnectButton className={`transition-all duration-300 rounded-lg hover:scale-105 ${
                            isScrolled ? 'px-4 py-1.5 text-sm' : 'px-6 py-2'
                        }`} />
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`sm:hidden transition-all duration-300 overflow-hidden ${
                        isMobileMenuOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                >
                    <div className="py-2 space-y-2">
                        {/* Wallet Buttons in Mobile Menu */}
                        <div className="flex flex-col gap-2 px-2 py-3 border-b border-gray-700">
                            <WalletMultiButton className="w-full" />
                            <WalletDisconnectButton className="w-full" />
                        </div>
                        
                        {/* Navigation Tabs in Mobile Menu */}
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabClick(tab)}
                                className={`w-full px-4 py-2 text-left transition-colors ${
                                    activeTab === tab
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Tab Navigation */}
                <div
                    className={`hidden sm:flex gap-1 -mb-px transition-all duration-300 ${
                        isScrolled ? 'h-0 overflow-hidden opacity-0' : 'h-12 opacity-100'
                    }`}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium transition-all duration-200 border-b-2 
                                ${
                                    activeTab === tab
                                        ? 'text-blue-500 border-blue-500'
                                        : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar; 