import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import React, { useState } from 'react';
import LoadingButton from './LoadingButton';

const Sendtransaction = () => {
    const wallet = useWallet();
    const { connection } = useConnection();   
    const [isLoading, setIsLoading] = useState(false);

    const makeTransaction = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        
        try {
            const receiverPublickey = document.getElementById('receiverPublickey').value;
            const amounttest = document.getElementById('amounttest').value;
            
            const transaction = new Transaction();
            transaction.add(SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(receiverPublickey),    
                lamports: parseFloat(amounttest) * LAMPORTS_PER_SOL,
            }));

            const signature = await wallet.sendTransaction(transaction, connection);
            alert("Sent " + amounttest + " SOL to " + receiverPublickey);
            console.log("Transaction sent with signature:", signature);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto w-full">
            <h2 className="text-2xl font-semibold mb-6">Send Solana</h2>
            
            <form onSubmit={makeTransaction} className="w-full space-y-4">
                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Receiver Address</label>
                    <input 
                        type="text" 
                        id="receiverPublickey"
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
                            focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 
                            transition-colors"
                        placeholder="Enter the receiver address"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-400">Amount (SOL)</label>
                    <input 
                        type="text"
                        id="amounttest"
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 
                            focus:border-blue-500 focus:outline-none text-white placeholder-gray-400 
                            transition-colors"
                        placeholder="Enter the amount"
                    />
                </div>

                <LoadingButton 
                    type="submit"
                    loading={isLoading}
                    disabled={!wallet.connected}
                >
                    {wallet.connected ? 'Send SOL' : 'Connect Wallet to Send'}
                </LoadingButton>
            </form>
        </div>
    );
};

export default Sendtransaction;
