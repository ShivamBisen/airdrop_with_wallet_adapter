import React from "react";
import { Line } from "react-chartjs-2";

const TokenPriceChart = ({ token, priceHistory, isLoading }) => {
	if (isLoading) {
		return (
			<div className="h-[400px] flex items-center justify-center">
				<div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
			</div>
		);
	}

	if (token.price === 0) {
		return (
			<div className="h-[400px] flex items-center justify-center text-gray-400">
				No price data available for this token
			</div>
		);
	}

	if (!priceHistory.length) {
		return (
			<div className="h-[400px] flex items-center justify-center text-gray-400">
				Failed to load price history
			</div>
		);
	}

	return (
		<div className="h-[400px] w-full">
			<Line
				data={{
					labels: priceHistory.map((point) => point.timestamp),
					datasets: [
						{
							label: `${token.symbol} Price`,
							data: priceHistory.map((point) => point.price),
							borderColor: "rgb(59, 130, 246)",
							backgroundColor: "rgba(59, 130, 246, 0.1)",
							fill: true,
							tension: 0.4,
						},
					],
				}}
				options={{
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false,
						},
						tooltip: {
							mode: "index",
							intersect: false,
							callbacks: {
								label: (context) => {
									return `$${context.parsed.y.toFixed(2)}`;
								},
							},
						},
					},
					scales: {
						y: {
							grid: {
								color: "rgba(255, 255, 255, 0.1)",
							},
							ticks: {
								color: "rgba(255, 255, 255, 0.7)",
								callback: (value) => `$${value.toFixed(2)}`,
							},
						},
						x: {
							grid: {
								display: false,
							},
							ticks: {
								color: "rgba(255, 255, 255, 0.7)",
								maxTicksLimit: 8,
							},
						},
					},
					interaction: {
						intersect: false,
						mode: "index",
					},
				}}
			/>
		</div>
	);
};

export default TokenPriceChart;
