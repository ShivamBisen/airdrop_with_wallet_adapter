import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import LoadingButton from "./LoadingButton";
import TokenPriceChart from "./TokenMarket/TokenPriceChart";

const COINCAP_API = "https://api.coincap.io/v2";

const SAMPLE_TOKENS = [
	{
		mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
		balance: 1000,
		decimals: 9,
		symbol: "USDC",
		name: "USD Coin",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
		price: 1.0,
		change24h: 0.01,
		coincapId: "usd-coin",
	},
	{
		mint: "SOL",
		balance: 5.75,
		decimals: 9,
		symbol: "SOL",
		name: "Solana",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
		price: 95.23,
		change24h: 3.45,
		coincapId: "solana",
	},
	{
		mint: "BONK",
		balance: 1000000,
		decimals: 9,
		symbol: "BONK",
		name: "Bonk",
		icon: "https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I",
		price: 0.000012,
		change24h: -2.34,
		coincapId: "bonk",
	},
	{
		mint: "RAY",
		balance: 50.5,
		decimals: 9,
		symbol: "RAY",
		name: "Raydium",
		icon: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png",
		price: 0.89,
		change24h: -1.2,
		coincapId: "raydium",
	},
];

const Tokens = () => {
	const [tokens, setTokens] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const { connection } = useConnection();
	const wallet = useWallet();
	const [showingSamples, setShowingSamples] = useState(false);
	const [selectedToken, setSelectedToken] = useState(null);
	const [priceHistory, setPriceHistory] = useState([]);
	const [isLoadingChart, setIsLoadingChart] = useState(false);

	const fetchTokenPrice = async (symbol) => {
		try {
			const response = await fetch(
				`${COINCAP_API}/assets?search=${symbol}&limit=1`
			);
			const { data } = await response.json();
			if (data && data.length > 0) {
				return {
					id: data[0].id,
					price: parseFloat(data[0].priceUsd),
					change24h: parseFloat(data[0].changePercent24Hr),
				};
			}
			return null;
		} catch (error) {
			console.error("Error fetching token price:", error);
			return null;
		}
	};

	const fetchTokenHistory = async (tokenId) => {
		setIsLoadingChart(true);
		try {
			const response = await fetch(
				`${COINCAP_API}/assets/${tokenId}/history?interval=h1`
			);
			const { data } = await response.json();

			const history = data.map((point) => ({
				timestamp: new Date(point.time).toLocaleTimeString(),
				price: parseFloat(point.priceUsd),
			}));

			setPriceHistory(history);
		} catch (error) {
			console.error("Error fetching price history:", error);
			setPriceHistory([]);
		} finally {
			setIsLoadingChart(false);
		}
	};

	const fetchTokens = async () => {
		if (!wallet.publicKey) return;

		try {
			setIsLoading(true);
			const tokenAccounts =
				await connection.getParsedTokenAccountsByOwner(
					wallet.publicKey,
					{ programId: TOKEN_PROGRAM_ID }
				);

			const tokenDetails = await Promise.all(
				tokenAccounts.value.map(async (token) => {
					const mintAddress = token.account.data.parsed.info.mint;
					try {
						const response = await fetch(
							`https://public-api.solscan.io/token/meta?tokenAddress=${mintAddress}`
						);
						const metadata = await response.json();
						const priceData = await fetchTokenPrice(
							metadata.symbol
						);

						return {
							mint: mintAddress,
							balance:
								token.account.data.parsed.info.tokenAmount
									.uiAmount,
							decimals:
								token.account.data.parsed.info.tokenAmount
									.decimals,
							symbol: metadata.symbol || "Unknown",
							name: metadata.name || "Unknown Token",
							icon: metadata.icon || null,
							price: priceData?.price || 0,
							change24h: priceData?.change24h || 0,
							coincapId: priceData?.id,
						};
					} catch (error) {
						console.error("Error fetching token metadata:", error);
						return {
							mint: mintAddress,
							balance:
								token.account.data.parsed.info.tokenAmount
									.uiAmount,
							decimals:
								token.account.data.parsed.info.tokenAmount
									.decimals,
							symbol: "Unknown",
							name: "Unknown Token",
							icon: null,
							price: 0,
							change24h: 0,
							coincapId: null,
						};
					}
				})
			);

			setTokens(tokenDetails);
		} catch (error) {
			console.error("Error fetching tokens:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		if (wallet.publicKey) {
			fetchTokens();
		} else {
			setTokens([]);
			setSelectedToken(null);
		}
	}, [wallet.publicKey, connection]);

	const handleTokenSelect = async (token) => {
		setSelectedToken(token);
		if (token.coincapId) {
			await fetchTokenHistory(token.coincapId);
		} else {
			setPriceHistory([]);
		}
	};

	const formatPrice = (price) => {
		if (price === 0) return "N/A";
		if (price < 0.01) return price.toFixed(6);
		if (price < 1) return price.toFixed(4);
		return price.toFixed(2);
	};

	const handleShowSamples = () => {
		setShowingSamples(!showingSamples);
		setSelectedToken(null);
		setPriceHistory([]);
		if (!showingSamples) {
			setTokens(SAMPLE_TOKENS);
		} else {
			if (wallet.publicKey) {
				fetchTokens();
			} else {
				setTokens([]);
			}
		}
	};

	return (
		<div className="flex flex-col items-center max-w-4xl mx-auto w-full">
			<div className="flex justify-between items-center w-full mb-6">
				<h2 className="text-2xl font-semibold">
					{showingSamples ? "Sample Tokens" : "Your Tokens"}
				</h2>
				<div className="flex gap-4">
					<button
						onClick={handleShowSamples}
						className="text-sm bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded-lg
							transition-colors duration-200 whitespace-nowrap"
					>
						{showingSamples ? "Show Real Tokens" : "Show Samples"}
					</button>
					<LoadingButton
						onClick={fetchTokens}
						loading={isLoading}
						disabled={!wallet.connected || showingSamples}
						className="px-4 py-2 text-sm"
					>
						Refresh
					</LoadingButton>
				</div>
			</div>

			{!wallet.connected && !showingSamples ? (
				<div className="text-gray-500">
					Connect your wallet to view tokens or click "Show Samples"
					to see example tokens
				</div>
			) : tokens.length === 0 ? (
				<div className="text-gray-500">No tokens found</div>
			) : (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
						{tokens.map((token) => (
							<div
								key={token.mint}
								onClick={() => handleTokenSelect(token)}
								className={`bg-gray-700 rounded-lg p-4 flex items-center gap-4 cursor-pointer
									transition-colors duration-200 hover:bg-gray-600 
									${
										selectedToken?.mint === token.mint
											? "bg-blue-500/10 border border-blue-500/50"
											: ""
									}`}
							>
								<div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
									{token.icon ? (
										<img
											src={token.icon}
											alt={token.symbol}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-2xl">
											{token.symbol.charAt(0)}
										</span>
									)}
								</div>
								<div className="flex-1">
									<div className="flex justify-between">
										<div>
											<div className="font-medium">
												{token.name}
											</div>
											<div className="text-sm text-gray-400">
												{token.balance} {token.symbol}
											</div>
										</div>
										{token.price > 0 && (
											<div className="text-right">
												<div className="font-medium">
													${formatPrice(token.price)}
												</div>
												<div
													className={`text-sm ${
														token.change24h >= 0
															? "text-green-400"
															: "text-red-400"
													}`}
												>
													{token.change24h > 0
														? "+"
														: ""}
													{token.change24h.toFixed(2)}
													%
												</div>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* Token Chart */}
					{selectedToken && (
						<div className="mt-8 p-6 bg-gray-700 rounded-lg w-full">
							<div className="flex items-start gap-4 mb-6">
								<div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
									{selectedToken.icon ? (
										<img
											src={selectedToken.icon}
											alt={selectedToken.symbol}
											className="w-full h-full object-cover"
										/>
									) : (
										<span className="text-2xl">
											{selectedToken.symbol.charAt(0)}
										</span>
									)}
								</div>
								<div className="flex-1 flex justify-between items-start">
									<div>
										<h3 className="text-xl font-semibold">
											{selectedToken.name}
										</h3>
										<p className="text-gray-400">
											{selectedToken.balance}{" "}
											{selectedToken.symbol}
										</p>
									</div>
									{selectedToken.price > 0 && (
										<div className="text-right">
											<p className="text-2xl font-bold">
												$
												{formatPrice(
													selectedToken.price
												)}
											</p>
											<p
												className={`text-sm ${
													selectedToken.change24h >= 0
														? "text-green-400"
														: "text-red-400"
												}`}
											>
												{selectedToken.change24h > 0
													? "+"
													: ""}
												{selectedToken.change24h.toFixed(
													2
												)}
												%
											</p>
										</div>
									)}
								</div>
							</div>

							<TokenPriceChart
								token={selectedToken}
								priceHistory={priceHistory}
								isLoading={isLoadingChart}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default Tokens;
