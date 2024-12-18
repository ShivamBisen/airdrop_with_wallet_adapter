import { useState, useMemo } from 'react';
import './App.css';
import './output.css';

import React from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import Airdrop from './components/Airdrop';
import Balance from './components/Balance';
import Sendtransaction from './components/Transaction';
import Swap from './components/Swap';

function App() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);

    // State for active tab
    const [activeTab, setActiveTab] = useState('Balance');

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="flex flex-col gap-7 items-center">
                        {/* Wallet Buttons */}
                        <div className="flex gap-6">
                            <WalletMultiButton />
                            <WalletDisconnectButton />
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-4">
                            <button
                                className={`px-4 py-2 rounded ${
                                    activeTab === 'Balance' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                                onClick={() => setActiveTab('Balance')}
                            >
                                Balance
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${
                                    activeTab === 'Airdrop' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                                onClick={() => setActiveTab('Airdrop')}
                            >
                                Airdrop
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${
                                    activeTab === 'SendTransaction' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                                onClick={() => setActiveTab('SendTransaction')}
                            >
                                Send Transaction
                            </button>
                            <button
                                className={`px-4 py-2 rounded ${
                                    activeTab === 'Swap' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                                }`}
                                onClick={() => setActiveTab('Swap')}
                            >
                                Swap
                            </button>
                        </div>

                        {/* Conditional Rendering of Components */}
                        <div className="mt-6">
                            {activeTab === 'Balance' && <Balance />}
                            {activeTab === 'Airdrop' && <Airdrop />}
                            {activeTab === 'SendTransaction' && <Sendtransaction />}
                            {activeTab === 'Swap' && <Swap />}
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
