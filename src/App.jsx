import { useState, useMemo } from "react";
import React from "react";
import {
	ConnectionProvider,
	WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import Navbar from "./components/Navbar";
import Airdrop from "./components/Airdrop";
import Balance from "./components/Balance";
import Sendtransaction from "./components/Transaction";
import Swap from "./components/Swap";
import Tokens from "./components/Tokens";
import TokenMarket from "./components/TokenMarket/TokenMarket";

function App() {
	const network = WalletAdapterNetwork.Devnet;
	const endpoint = useMemo(() => clusterApiUrl(network), [network]);
	const wallets = useMemo(() => [new UnsafeBurnerWalletAdapter()], [network]);
	const [activeTab, setActiveTab] = useState("Balance");

	return (
		<ConnectionProvider endpoint={endpoint}>
			<WalletProvider wallets={wallets} autoConnect>
				<WalletModalProvider>
					<div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
						<Navbar
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>

						<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
							<div className="space-y-8">
								{/* Main Content */}
								<div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
									{activeTab === "Balance" && <Balance />}
									{activeTab === "Airdrop" && <Airdrop />}
									{activeTab === "SendTransaction" && (
										<Sendtransaction />
									)}
									{activeTab === "Swap" && <Swap />}
								</div>

								{/* Tokens Section */}
								<div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
									<Tokens />
								</div>

								{/* Token Market Section */}
								<div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
									<TokenMarket />
								</div>
							</div>
						</main>
					</div>
				</WalletModalProvider>
			</WalletProvider>
		</ConnectionProvider>
	);
}

export default App;
