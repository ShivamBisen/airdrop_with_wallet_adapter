import { useState } from 'react'
import './App.css'
import './output.css'

import React, { FC, useMemo } from 'react';
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

function App() {

  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
       
        new UnsafeBurnerWalletAdapter(),
    ],
    [network]
);

  return (


    
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <div className=" flex flex-col gap-7 items-center ">
                    <div className="flex gap-6 ">
                      <WalletMultiButton />
                      <WalletDisconnectButton />
                    </div>
                      
                      <Airdrop />
                  </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>

      
  )
}

export default App
