import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { VersionedTransaction } from '@solana/web3.js';
import axios from 'axios';

const Swap = () => {
  const [fromToken, setFromToken] = useState('So11111111111111111111111111111111111111112');
  const [toToken, setToToken] = useState('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  const [amount, setAmount] = useState('100000000');
  const wallet = useWallet();
  const { connection } = useConnection();

  const swap = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      console.error('Wallet not connected');
      return;
    }

    try {
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

      // Sign the transaction
      const signedTransaction = await wallet.signTransaction(transaction);

      // Serialize and send the transaction
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
    }
  };

  return (
    <div className='flex flex-col '>
      <h1>Token Swap</h1>
      <div className=" flex flex-col">
      <input
        type="text"
        placeholder="From Token Mint"
        className='p-2 rounded-md'
        value={fromToken}
        onChange={(e) => setFromToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Token Mint"
        className='p-2 rounded-md'
        value={toToken}
        onChange={(e) => setToToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="Amount"
        className='p-2 rounded-md'
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /></div>
      <button className='mt-2' onClick={swap}>Swap</button>
    </div>
  );
};

export default Swap;
