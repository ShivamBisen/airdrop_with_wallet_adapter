import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'


const Balance = () => {
    const [balance,setBalance] = useState()
    const wallet = useWallet()
    const {connection} = useConnection()
    useEffect(()=>{
        const getBalance = async()=>{
             const fetchedbalance =  await connection.getBalance(wallet.publicKey)
             setBalance(fetchedbalance/LAMPORTS_PER_SOL)
        }
        try{
            getBalance()
        }catch(error){
            console.error("Failed to get balance:", error);
        }
    },[wallet.publicKey, connection]    )

  return (
    <div className='flex gap-2'>
        <h1>Balance : </h1>
        {balance !== null ? balance: 'Loading...'}
    </div>
  )
}

export default Balance