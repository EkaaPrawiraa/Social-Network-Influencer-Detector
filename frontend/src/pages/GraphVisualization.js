import React, { useState, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";
import calculateInfluenceFactor from "../utils/eigenvector";
import {
	Box,
	CircularProgress,
	Paper,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

const GraphVisualization = ({ users, tweets }) => {
	const [graphData, setGraphData] = useState({ nodes: [], links: [] });
	const [influenceValues, setInfluenceValues] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	useEffect(() => {
		const calculateInfluence = async () => {
			setIsLoading(true);
			const eigenResult = await calculateInfluenceFactor(users, tweets);
			setInfluenceValues(eigenResult);

			const nodes = users.map((user) => ({
				id: user.user_id,
				label: `${user.username} (${eigenResult[user.user_id].toFixed(2)})`,
				influence: eigenResult[user.user_id],
			}));

			const links = [];
			tweets.forEach((tweet) => {
				const userId = tweet.user_id;
				const repliedToTweetId = tweet.replied_to_tweet_id;
				if (repliedToTweetId) {
					const repliedToTweet = tweets.find(
						(t) => t.tweet_id === repliedToTweetId
					);
					if (repliedToTweet) {
						const repliedToUserId = repliedToTweet.user_id;
						links.push({
							source: userId,
							target: repliedToUserId,
							label: "replied tweet to",
						});
					}
				}
			});
			console.log(nodes);
			setGraphData({ nodes, links });
			setIsLoading(false);
		};
		calculateInfluence();
	}, [users, tweets]);

	const refresh = () => {
		const calculateInfluence = async () => {
			setIsLoading(true);
			const eigenResult = await calculateInfluenceFactor(users, tweets);
			setInfluenceValues(eigenResult);

			const nodes = users.map((user) => ({
				id: user.user_id,
				label: `${user.username} (${eigenResult[user.user_id].toFixed(2)})`,
				influence: eigenResult[user.user_id],
			}));

			const links = [];
			tweets.forEach((tweet) => {
				const userId = tweet.user_id;
				const repliedToTweetId = tweet.replied_to_tweet_id;
				if (repliedToTweetId) {
					const repliedToTweet = tweets.find(
						(t) => t.tweet_id === repliedToTweetId
					);
					if (repliedToTweet) {
						const repliedToUserId = repliedToTweet.user_id;
						links.push({
							source: userId,
							target: repliedToUserId,
							label: "replied to",
						});
					}
				}
			});
			setGraphData({ nodes, links });
			setIsLoading(false);
		};
		calculateInfluence();

		setSnackbarMessage("The list successfully refreshed");
		setSnackbarSeverity("success");
		setSnackbarOpen(true);
	};
	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	const nodeColor = (node) => {
		const influence = influenceValues[node.id];
		const opacity = Math.min(Math.max(influence, 0.5), 1);
		return `rgba(255, 255, 255, ${opacity})`;
	};

	const nodeSize = (node) => {
		const influence = influenceValues[node.id];
		return Math.max(Math.log(influence + 1) * 10, 5);
	};

	const edgeWidth = (edge) => {
		const sourceInfluence = influenceValues[edge.source];
		const targetInfluence = influenceValues[edge.target];
		return Math.max(sourceInfluence, targetInfluence) * 2;
	};

	const linkColor = () => "#FF0000";

	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "60vh",
				// background: "linear-gradient(135deg, #000000, #434343)",
			}}
		>
			<Box
				elevation={3}
				sx={{
					width: "60%",
					height: "100%",
					borderRadius: 4,
					padding: 2,
					position: "relative",
					overflow: "hidden",
				}}
			>
				{isLoading ? (
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							height: "60%",
						}}
					>
						<CircularProgress />
					</Box>
				) : (
					<ForceGraph2D
						graphData={graphData}
						nodeLabel={(node) => node.label}
						nodeColor={nodeColor}
						nodeSize={nodeSize}
						linkColor={linkColor}
						linkDirectionalArrowLength={3}
						linkDirectionalArrowRelPos={1}
						cooldownTicks={100}
						onNodeClick={(node) => console.log(`Clicked node ${node.label}`)}
						edgeWidth={edgeWidth}
						linkLabel={(link) => link.label}
						linkDirectionalParticles={1}
						linkDirectionalParticleSpeed={0.009}
					/>
				)}
			</Box>
			<IconButton
				onClick={refresh}
				style={{
					position: "absolute",
					top: "10px",
					right: "10px",
					color: "black",
					backgroundColor: "white",
				}}
			>
				<RefreshIcon />
			</IconButton>
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleSnackbarClose}
			>
				<Alert
					onClose={handleSnackbarClose}
					severity={snackbarSeverity}
					sx={{ width: "100%" }}
				>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default GraphVisualization;
