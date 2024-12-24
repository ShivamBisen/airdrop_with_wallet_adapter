import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useState } from 'react'
import LoadingButton from './LoadingButton';

const Airdrop = () => {
  const wallet = useWallet()
  const WALLET_ADDRESS = wallet.publicKey
  const {connection} = useConnection()
  const [isLoading, setIsLoading] = useState(false);

  const requestAirdrop = async() => {
    try {
      setIsLoading(true);
      const AIRDROP_AMOUNT = document.getElementById('amount')?.value;
      
      console.log(`Requesting airdrop for ${WALLET_ADDRESS}`);
      const signature = await connection.requestAirdrop(
        WALLET_ADDRESS,
        parseFloat(AIRDROP_AMOUNT*LAMPORTS_PER_SOL)
      );
      alert(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    } catch(error) {
      console.error("Airdrop request failed:", error);
      alert("Airdrop request failed. See console for details.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center max-w-md mx-auto w-full">
      <h2 className="text-2xl font-semibold mb-6">Request Airdrop</h2>
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Amount (SOL)</label>
          <input 
            type="number"
            id="amount"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
              focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 
              transition-colors"
            placeholder="Enter SOL amount"
          />
        </div>
        
        <LoadingButton 
          onClick={requestAirdrop}
          loading={isLoading}
          disabled={!wallet.connected}
        >
          {wallet.connected ? 'Request Airdrop' : 'Connect Wallet to Request'}
        </LoadingButton>
      </div>
    </div>
  )
}

export default Airdrop