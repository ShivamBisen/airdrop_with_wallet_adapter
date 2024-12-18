import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import React from 'react';

const Sendtransaction = () => {
    const wallet = useWallet();
    const { connection } = useConnection();   

    const makeTransaction = async (event) => {
        event.preventDefault(); // Prevent default form submission

        const receiverPublickey = document.getElementById('receiverPublickey').value;
        const amounttest = document.getElementById('amounttest').value;
       
        
        console.log(amounttest); // Check what is being logged
        console.log('hi');
        
        const transaction = new Transaction();

        transaction.add(SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(receiverPublickey),    
            lamports: parseFloat(amounttest) * LAMPORTS_PER_SOL, // Ensure amount is correctly parsed
        }));

        try {
            const signature = await wallet.sendTransaction(transaction, connection);
            alert("Sent " + amounttest + " SOL to " + receiverPublickey);
            console.log("Transaction sent with signature:", signature);
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Transaction failed: " + error.message);
        }
    };

    return (
        <div className='flex flex-col gap-6 items-center '>
            <p className='text-2xl'>Send Solana</p>
            <form className="flex gap-2" onSubmit={makeTransaction}>
                <input type="text" id='receiverPublickey' className='p-2 rounded-md' placeholder='Enter the receiver address' />
                <input type="text" id='amounttest' className='p-2 rounded-md' placeholder='Enter the amount' />


                {/* <input type="number" id='amount' className='p-2 rounded-md' placeholder='Enter the amount' />    */}
                <button type='submit' className='px-4'>Send</button>
            </form>
        </div>
    );
};

export default Sendtransaction;
