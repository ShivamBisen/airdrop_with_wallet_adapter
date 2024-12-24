import React, { useState, useEffect } from "react";
import TokenSearch from "./TokenSearch";
import TokenPriceChart from "./TokenPriceChart";
import LoadingButton from "../LoadingButton";

const CATEGORIES = ["Popular", "Gainers", "Losers"];
const COINCAP_API = "https://api.coincap.io/v2";
const SOLANA_TOKEN_LIST =
	"https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/src/tokens/solana.tokenlist.json";

const TokenMarket = () => {
	const [selectedCategory, setSelectedCategory] = useState("Popular");
	const [selectedToken, setSelectedToken] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [marketData, setMarketData] = useState({
		popular: [],
		gainers: [],
		losers: [],
	});
	const [searchResults, setSearchResults] = useState([]);
	const [tokenList, setTokenList] = useState([]);
	const [priceHistory, setPriceHistory] = useState([]);
	const [isLoadingChart, setIsLoadingChart] = useState(false);

	const fetchTokenList = async () => {
		try {
			const response = await fetch(SOLANA_TOKEN_LIST);
			const data = await response.json();
			setTokenList(data.tokens);
		} catch (error) {
			console.error("Error fetching token list:", error);
		}
	};

	const fetchMarketData = async () => {
		setIsLoading(true);
		try {
			// Fetch top 100 assets from CoinCap
			const response = await fetch(`${COINCAP_API}/assets?limit=100`);
			const { data } = await response.json();

			// Process and categorize the data
			const processed = data.map((coin) => ({
				id: coin.id,
				symbol: coin.symbol,
				name: coin.name,
				price: parseFloat(coin.priceUsd),
				change24h: parseFloat(coin.changePercent24Hr),
				marketCap: parseFloat(coin.marketCapUsd),
				volume: parseFloat(coin.volumeUsd24Hr),
				// Find matching token from Solana token list for the logo
				image:
					tokenList.find(
						(t) =>
							t.symbol.toLowerCase() === coin.symbol.toLowerCase()
					)?.logoURI ||
					`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
			}));

			// Sort by different criteria
			const popular = processed.slice(0, 12); // Top 12 by market cap
			const gainers = [...processed]
				.sort((a, b) => b.change24h - a.change24h)
				.slice(0, 12);
			const losers = [...processed]
				.sort((a, b) => a.change24h - b.change24h)
				.slice(0, 12);

			setMarketData({ popular, gainers, losers });
		} catch (error) {
			console.error("Error fetching market data:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const fetchTokenHistory = async (tokenId) => {
		setIsLoadingChart(true);
		try {
			// Fetch last 24 hours of price history with 1-hour intervals
			const response = await fetch(
				`${COINCAP_API}/assets/${tokenId}/history?interval=h1`
			);
			const { data } = await response.json();

			// Process the historical data
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

	useEffect(() => {
		fetchTokenList();
	}, []);

	useEffect(() => {
		if (tokenList.length > 0) {
			fetchMarketData();
			// Refresh data every 2 minutes
			const interval = setInterval(fetchMarketData, 120000);
			return () => clearInterval(interval);
		}
	}, [tokenList]);

	const handleSearch = async (term) => {
		if (!term) {
			setSearchResults([]);
			return;
		}

		try {
			// Search in both CoinCap assets and Solana token list
			const response = await fetch(
				`${COINCAP_API}/assets?search=${term}&limit=6`
			);
			const { data } = await response.json();

			const results = data.map((coin) => ({
				id: coin.id,
				symbol: coin.symbol,
				name: coin.name,
				price: parseFloat(coin.priceUsd),
				change24h: parseFloat(coin.changePercent24Hr),
				marketCap: parseFloat(coin.marketCapUsd),
				volume: parseFloat(coin.volumeUsd24Hr),
				image:
					tokenList.find(
						(t) =>
							t.symbol.toLowerCase() === coin.symbol.toLowerCase()
					)?.logoURI ||
					`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`,
			}));

			// Also search in Solana token list
			const solanaResults = tokenList
				.filter(
					(token) =>
						token.name.toLowerCase().includes(term.toLowerCase()) ||
						token.symbol.toLowerCase().includes(term.toLowerCase())
				)
				.slice(0, 6)
				.map((token) => ({
					id: token.address,
					symbol: token.symbol,
					name: token.name,
					price: 0, // Price not available for all Solana tokens
					change24h: 0,
					marketCap: 0,
					volume: 0,
					image: token.logoURI,
				}));

			setSearchResults([...results, ...solanaResults]);
		} catch (error) {
			console.error("Error searching tokens:", error);
		}
	};

	const handleTokenSelect = async (token) => {
		setSelectedToken(token);
		if (token.price > 0) {
			// Only fetch history for tokens with price data
			await fetchTokenHistory(token.id);
		}
	};

	const formatPrice = (price) => {
		if (price === 0) return "N/A";
		if (price < 0.01) return price.toFixed(6);
		if (price < 1) return price.toFixed(4);
		return price.toFixed(2);
	};

	return (
		<div className="w-full space-y-6">
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<h2 className="text-2xl font-semibold">Token Market</h2>
				<TokenSearch onSearch={handleSearch} />
			</div>

			{/* Category Tabs */}
			<div className="flex gap-4 border-b border-gray-700">
				{CATEGORIES.map((category) => (
					<button
						key={category}
						onClick={() => setSelectedCategory(category)}
						className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 -mb-[1px] ${
							selectedCategory === category
								? "text-blue-500 border-blue-500"
								: "text-gray-400 border-transparent hover:text-gray-200"
						}`}
					>
						{category}
					</button>
				))}
			</div>

			{/* Token List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{isLoading ? (
					<div className="col-span-3 text-center py-12">
						<div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
						<p className="mt-4 text-gray-400">
							Loading market data...
						</p>
					</div>
				) : (
					(searchResults.length > 0
						? searchResults
						: marketData[selectedCategory.toLowerCase()]
					).map((token) => (
						<div
							key={token.id}
							onClick={() => handleTokenSelect(token)}
							className={`p-4 rounded-lg transition-all duration-200 cursor-pointer
                                ${
									selectedToken?.id === token.id
										? "bg-blue-500/10 border border-blue-500/50"
										: "bg-gray-700 hover:bg-gray-600"
								}`}
						>
							<div className="flex items-center gap-4">
								<img
									src={token.image}
									alt={token.name}
									className="w-8 h-8 rounded-full"
								/>
								<div className="flex-1">
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium">
												{token.name}
											</h3>
											<p className="text-sm text-gray-400">
												{token.symbol}
											</p>
										</div>
										<div className="text-right">
											<p className="font-medium">
												${formatPrice(token.price)}
											</p>
											<p
												className={`text-sm ${
													token.change24h >= 0
														? "text-green-400"
														: "text-red-400"
												}`}
											>
												{token.change24h > 0 ? "+" : ""}
												{token.change24h?.toFixed(2)}%
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>

			{/* Token Chart */}
			{selectedToken && (
				<div className="mt-8 p-6 bg-gray-700 rounded-lg">
					<div className="flex items-start gap-4 mb-6">
						<img
							src={selectedToken.image}
							alt={selectedToken.name}
							className="w-12 h-12 rounded-full"
						/>
						<div className="flex-1 flex justify-between items-start">
							<div>
								<h3 className="text-xl font-semibold">
									{selectedToken.name}
								</h3>
								<p className="text-gray-400">
									{selectedToken.symbol}
								</p>
							</div>
							<div className="text-right">
								<p className="text-2xl font-bold">
									${formatPrice(selectedToken.price)}
								</p>
								<p
									className={`text-sm ${
										selectedToken.change24h >= 0
											? "text-green-400"
											: "text-red-400"
									}`}
								>
									{selectedToken.change24h > 0 ? "+" : ""}
									{selectedToken.change24h?.toFixed(2)}%
								</p>
							</div>
						</div>
					</div>

					<TokenPriceChart
						token={selectedToken}
						priceHistory={priceHistory}
						isLoading={isLoadingChart}
					/>
				</div>
			)}
		</div>
	);
};

export default TokenMarket;
