import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Button,
	TextField,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Snackbar,
	Alert,
	Avatar,
	Grid,
	Link,
	Badge,
} from "@mui/material";
import '@fontsource/playfair-display';

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ReplyIcon from "@mui/icons-material/Reply";
import RetweetIcon from "@mui/icons-material/Repeat";

import AddIcon from "@mui/icons-material/Add";

const TweetManagement = ({ SetTweet }) => {
	const [tweets, setTweets] = useState([]);
	const [idTweet, setIdTweet] = useState("");
	const [content, setContent] = useState("");
	const [createdAt, setCreatedAt] = useState("");
	const [likesCount, setLikesCount] = useState("");
	const [userId, setUserId] = useState("");
	const [retweetCount, setRetweetCount] = useState("");
	const [repliedToTweetId, setRepliedToTweetId] = useState("");
	const [editingTweet, setEditingTweet] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [dialogType, setDialogType] = useState("add");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	useEffect(() => {
		fetchTweets();
	}, []);

	useEffect(() => {
		if (SetTweet) {
			const newTweets = tweets.map((tweet) => ({
				tweet_id: tweet.tweet_id,
				user_id: tweet.user_id,
				content: tweet.content,
				likes_count: tweet.likes_count,
				retweets_count: tweet.retweets_count,
				replied_to_tweet_id: tweet.replied_to_tweet_id,
				created_at: tweet.created_at.substring(0, 10),
			}));
			SetTweet(newTweets);
		}
	}, [tweets, SetTweet]);

	const fetchTweets = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5001/api/tweetswithuser"
			);
			setTweets(response.data);
		} catch (error) {
			console.error("Error fetching tweets:", error);
			setSnackbarMessage("Error fetching tweets");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleOpenDialog = (type, tweet = null) => {
		setDialogType(type);
		setEditingTweet(tweet);
		if (type === "edit" && tweet) {
			setIdTweet(tweet.tweet_id);
			setUserId(tweet.user_id);
			setContent(tweet.content);
			setLikesCount(tweet.likes_count);
			setRetweetCount(tweet.retweets_count);
			setRepliedToTweetId(tweet.replied_to_tweet_id);
			setCreatedAt(tweet.created_at.substring(0, 10));
		} else {
			resetForm();
		}
		setShowDialog(true);
	};

	const resetForm = () => {
		setIdTweet("");
		setContent("");
		setUserId("");
		setCreatedAt("");
		setLikesCount("");
		setRetweetCount("");
		setRepliedToTweetId("");
	};

	const handleCloseDialog = () => {
		setShowDialog(false);
		setEditingTweet(null);
		resetForm();
	};

	const handleSubmit = async () => {
		if (dialogType === "add") {
			try {
				const response = await axios.post("http://localhost:5001/api/tweets", {
					user_id: userId,
					content: content,
					likes_count: likesCount === "" ? 0 : likesCount,
					retweets_count: retweetCount === "" ? 0 : retweetCount,
					replied_to_tweet_id: repliedToTweetId === "" ? null : repliedToTweetId,
					created_at: createdAt,
				});
				setTweets([...tweets, response.data]);
				setSnackbarMessage("Tweet added successfully");
				setSnackbarSeverity("success");
			} catch (error) {
				console.error("Error adding tweet:", error);
				setSnackbarMessage("Error adding tweet");
				setSnackbarSeverity("error");
			}
		} else if (dialogType === "edit" && editingTweet) {
			try {
				const response = await axios.put(
					`http://localhost:5001/api/tweets/${editingTweet.tweet_id}`,
					{
						user_id: userId,
						content: content,
						likes_count: likesCount,
						retweets_count: retweetCount,
						replied_to_tweet_id:
							repliedToTweetId === "" ? null : repliedToTweetId,
					}
				);
				setTweets(
					tweets.map((u) =>
						u.tweet_id === response.data.tweet_id ? response.data : u
					)
				);
				setSnackbarMessage("Tweet updated successfully");
				setSnackbarSeverity("success");
			} catch (error) {
				console.error("Error updating tweet:", error);
				setSnackbarMessage("Error updating tweet");
				setSnackbarSeverity("error");
			}
		}
		handleCloseDialog();
		setSnackbarOpen(true);
	};

	const handleDeleteTweet = async (id) => {
		try {
			await axios.delete(`http://localhost:5001/api/tweets/${id}`);
			setTweets(tweets.filter((tweet) => tweet.tweet_id !== id));
			setSnackbarMessage("Tweet deleted successfully");
			setSnackbarSeverity("success");
		} catch (error) {
			console.error("Error deleting tweet:", error);
			setSnackbarMessage("Error deleting tweet");
			setSnackbarSeverity("error");
		}
		setSnackbarOpen(true);
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	function formatNumber(num) {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		} else {
			return num.toString();
		}
	}

	return (
		<Box
			sx={{
				height: "60vh",
				overflowY: "auto",
				width: "100%",
				padding: "2rem",
				// background: "linear-gradient(135deg, #1a1a2e, #16213e)",
				borderRadius: "16px",
				boxShadow: "0 10px 20px rgba(0, 0, 0, 0.5)",
				maxWidth: "100%",
				margin: "auto",
				"&::-webkit-scrollbar": {
					display: "none",
				},
				"-ms-overflow-style": "none",
				"scrollbar-width": "none",
				transition: "transform 0.2s ease-in-out",
				
			}}
		>
			<Box
				sx={{
					
					marginBottom: "1rem",
				}}
			>
				{tweets.map((tweet) => (
					<Box
						key={tweet.tweet_id}
						sx={{
							marginBottom: "1rem",
							background: "linear-gradient(135deg, #000000, #434343)",
							border: "3px solid rgba(255, 255, 255, 0.1)",
							borderRadius: "12px",
							boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
							padding: "1.5rem",
							transition: "transform 0.2s ease-in-out",
							"&:hover": {
								transform: "scale(1.03)",
							},
						}}
					>
						<Grid container alignItems="center">
							<Grid item xs={1}>
								<Avatar
									alt="User Avatar"
									src={`https://picsum.photos/200/300?random=${tweet.user_id}`}
									sx={{
										width: "5rem",
										height: "5rem",
										marginRight: "1rem",
										border: "2px solid #00a8cc",
										boxShadow: "0 0 15px rgba(0, 168, 204, 0.7)",
										transition: "box-shadow 0.3s ease-in-out",
										"&:hover": {
											boxShadow: "0 0 25px rgba(0, 168, 204, 1)",
										},
									}}
								/>
							</Grid>
							<Grid item xs={9}>
								<Typography variant="subtitle1" sx={{ color: "#fff" }}>
									<Link
										href="#"
										sx={{ color: "#00a8cc", textDecoration: "none",fontFamily: "'Playfair Display', serif", }}
									>
										{`@${tweet.username}`}
									</Link>
								</Typography>
								<Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
									TweetID: {tweet.tweet_id}
								</Typography>
								<Typography
									variant="h5"
									color="#ffffff"
									fontFamily="Segoe UI, Arial, sans-serif"
									fontSize="18px"
									fontWeight="bold"
									sx={{
										marginTop: "0.5rem",
										transition: "color 0.3s ease-in-out",
										"&:hover": {
											color: "#00a8cc",
										},
									}}
								>
									{tweet.content}
								</Typography>
								<Typography variant="caption" color="rgba(255, 255, 255, 0.6)">
									{tweet.created_at.substring(0, 10)}
								</Typography>
								<Grid item xs={9} sx={{ marginTop: "0.5rem" }}>
									<Typography
										variant="caption"
										color="textSecondary"
										onClick={() => handleOpenDialog("edit", tweet)}
										sx={{
											paddingRight: "5px",
											cursor: "pointer",
											color: "rgba(255, 255, 255, 0.8)",
											"&:hover": {
												color: "#00a8cc",
											},
										}}
									>
										<u>
											<i>Edit</i>
										</u>
									</Typography>
									<Typography
										variant="caption"
										color="textSecondary"
										onClick={() => handleDeleteTweet(tweet.tweet_id)}
										sx={{
											cursor: "pointer",
											color: "rgba(255, 0, 0, 0.8)",
											"&:hover": {
												color: "rgba(255, 0, 0, 1)",
											},
										}}
									>
										<u>
											<i>Delete</i>
										</u>
									</Typography>
								</Grid>
							</Grid>
							<Grid item xs={2} textAlign="right">
								<IconButton aria-label="reply" size="small">
									<Badge
										badgeContent={tweet.replied_to_tweet_id}
										color="error"
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										sx={{
											"& .MuiBadge-dot": {
												borderRadius: "50%",
												width: "10px",
												height: "10px",
												backgroundColor: "red",
											},
										}}
									>
										<ReplyIcon sx={{ fontSize: 40, color: "white" }} />
									</Badge>
								</IconButton>
								<IconButton aria-label="retweet" size="small">
									<Badge
										badgeContent={formatNumber(tweet.retweets_count)}
										color="error"
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										sx={{
											"& .MuiBadge-dot": {
												borderRadius: "50%",
												width: "10px",
												height: "10px",
												backgroundColor: "red",
											},
										}}
									>
										<RetweetIcon sx={{ fontSize: 40, color: "white" }} />
									</Badge>
								</IconButton>
								<IconButton aria-label="like" size="small">
									<Badge
										badgeContent={formatNumber(tweet.likes_count)}
										color="error"
										anchorOrigin={{
											vertical: "top",
											horizontal: "right",
										}}
										sx={{
											"& .MuiBadge-dot": {
												borderRadius: "50%",
												width: "10px",
												height: "10px",
												backgroundColor: "red",
											},
										}}
									>
										<FavoriteBorderIcon sx={{ fontSize: 40, color: "white" }} />
									</Badge>
								</IconButton>
							</Grid>
						</Grid>
					</Box>
				))}
			</Box>

			<Box
				sx={{
					display: "flex",
					justifyContent: "flex-end",
					marginTop: "1rem",
				}}
			>
				<IconButton
					variant="contained"
					color="primary"
					onClick={() => handleOpenDialog("add")}
					sx={{
						backgroundColor: "white",
						width: "3rem",
						height: "3rem",
						fontSize: "2rem",
					}}
				>
					<AddIcon sx={{ fontSize: "2rem" }} />
				</IconButton>
			</Box>
			<Dialog open={showDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					{dialogType === "add" ? "Add Tweet" : "Edit Tweet"}
				</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						label="User ID"
						type="number"
						fullWidth
						value={userId}
						onChange={(e) => setUserId(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Content"
						type="text"
						fullWidth
						value={content}
						onChange={(e) => setContent(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Likes Count"
						type="number"
						fullWidth
						value={likesCount}
						onChange={(e) => setLikesCount(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Retweet Count"
						type="number"
						fullWidth
						value={retweetCount}
						onChange={(e) => setRetweetCount(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Replied to Tweet ID"
						type="number"
						fullWidth
						value={repliedToTweetId}
						onChange={(e) => setRepliedToTweetId(e.target.value)}
					/>
					<TextField
						margin="dense"
						label="Created At"
						type="date"
						fullWidth
						value={createdAt}
						onChange={(e) => setCreatedAt(e.target.value)}
						InputLabelProps={{ shrink: true }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary">
						{dialogType === "add" ? "Add" : "Save"}
					</Button>
				</DialogActions>
			</Dialog>
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
export default TweetManagement;
