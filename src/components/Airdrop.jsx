import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import React from 'react'



const Airdrop = () => {

  const wallet = useWallet()
  const WALLET_ADDRESS = wallet.publicKey
  const {connection} = useConnection()
  const AIRDROP_AMOUNT = document.getElementById('amount')?.value

  const requestAirdrop = async() =>{
    try{
      console.log(`Requesting airdrop for ${WALLET_ADDRESS}`);
    const  signature  = await connection.requestAirdrop(WALLET_ADDRESS,parseFloat(AIRDROP_AMOUNT*LAMPORTS_PER_SOL));
    alert(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
    }catch(error){
      console.error("Airdrop request failed:", error);
      alert("Airdrop request failed. See console for details.");
    }
    

  }
  return (
    <div className='flex gap-6'>
        <input className='p-2 rounded-md' type="number" id='amount' placeholder='enter the sol amount' />
        <button className='px-4' onClick={requestAirdrop} >Airdrop</button>
        
      
    </div>
  )
}

export default Airdrop