import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import React, { useEffect, useState } from 'react'
import LoadingButton from './LoadingButton'

const Balance = () => {
    const [balance, setBalance] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const wallet = useWallet()
    const {connection} = useConnection()

    const getBalance = async() => {
        if (!wallet.publicKey) return;
        
        try {
            setIsLoading(true)
            const fetchedbalance = await connection.getBalance(wallet.publicKey)
            setBalance(fetchedbalance/LAMPORTS_PER_SOL)
        } catch(error) {
            console.error("Failed to get balance:", error)
            setBalance(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (wallet.publicKey) {
            getBalance()
        } else {
            setBalance(null)
        }
    }, [wallet.publicKey, connection])

    const formatBalance = (balance) => {
        if (balance === null) return '0.0000'
        if (balance === 0) return '0.0000'
        return balance.toFixed(4)
    }

    return (
        <div className="flex flex-col items-center max-w-md mx-auto w-full">
            <h2 className="text-2xl font-semibold mb-6">Wallet Balance</h2>
            <div className="w-full bg-gray-700 rounded-lg px-6 py-4">
                <div className="text-gray-400 mb-1">Current Balance</div>
                <div className="flex flex-col gap-4">
                    <div className="text-3xl font-bold">
                        {!wallet.connected ? (
                            <span className="text-gray-500 ">Wallet not connected</span>
                        ) : isLoading ? (
                            <span className="text-gray-500">Loading...</span>
                        ) : (
                            `${formatBalance(balance)} SOL`
                        )}
                    </div>
                    
                    <LoadingButton 
                        onClick={getBalance}
                        loading={isLoading}
                        disabled={!wallet.connected}
                        className="text-sm py-2"
                    >
                        Refresh Balance
                    </LoadingButton>
                </div>
            </div>
        </div>
    )
}

export default Balance