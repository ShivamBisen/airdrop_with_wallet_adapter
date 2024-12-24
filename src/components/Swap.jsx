import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import axios from 'axios';
import LoadingButton from './LoadingButton';

const Swap = () => {
  const [fromToken, setFromToken] = useState('So11111111111111111111111111111111111111112');
  const [toToken, setToToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const [amount, setAmount] = useState('100000000');
  const [isLoading, setIsLoading] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const swap = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      console.error('Wallet not connected');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${fromToken}&outputMint=${toToken}&amount=${amount}&slippageBps=50`
      );
      const quoteResponse = response.data;

      const { data: { swapTransaction } } = await axios.post(
        'https://quote-api.jup.ag/v6/swap',
        {
          quoteResponse,
          userPublicKey: wallet.publicKey.toString(),
        }
      );

      const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
      const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      const signedTransaction = await wallet.signTransaction(transaction);
      const rawTransaction = signedTransaction.serialize();
      const latestBlockHash = await connection.getLatestBlockhash();

      const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true,
        maxRetries: 2,
      });

      await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
      });

      console.log('Transaction confirmed:', txid);
    } catch (error) {
      console.error('Error during swap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center max-w-md mx-auto w-full">
      <h2 className="text-2xl font-semibold mb-6">Token Swap</h2>
      
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">From Token</label>
          <input
            type="text"
            placeholder="From Token Mint"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
              focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 
              transition-colors"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">To Token</label>
          <input
            type="text"
            placeholder="To Token Mint"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
              focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 
              transition-colors"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-400">Amount</label>
          <input
            type="text"
            placeholder="Amount"
            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
              focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 
              transition-colors"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <LoadingButton 
          onClick={swap}
          loading={isLoading}
          disabled={!wallet.connected}
        >
          {wallet.connected ? 'Swap Tokens' : 'Connect Wallet to Swap'}
        </LoadingButton>
      </div>
    </div>
  );
};

export default Swap;
