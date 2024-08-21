import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	Box,
	Button,
	TextField,
	Typography,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	Snackbar,
	Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
			const response = await axios.get("http://localhost:5001/api/tweets");
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
					tweet_id: idTweet,
					user_id: userId,
					content: content,
					likes_count: likesCount,
					retweets_count: retweetCount,
					replied_to_tweet_id: repliedToTweetId == '' ? null: repliedToTweetId,
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
						replied_to_tweet_id: repliedToTweetId == '' ? null: repliedToTweetId,
						
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

	return (
		<Box
			sx={{
				padding: "2rem",
				backgroundColor: "#f4f4f4",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
				maxWidth: "1200px",
				margin: "auto",
			}}
		>
			<Typography variant="h4" component="h1" gutterBottom align="center">
				<b>Tweet Management</b>
			</Typography>
			<Box
				sx={{
					overflowX: "auto",
					marginBottom: "1rem",
				}}
			>
				<TableContainer
					sx={{
						backgroundColor: "white",
						borderRadius: "8px",
						boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
					}}
				>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell sx={{ textAlign: "center" }}>ID</TableCell>
								<TableCell sx={{ textAlign: "center" }}>UserID</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Content</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Likes</TableCell>
								<TableCell sx={{ textAlign: "center" }}>
									Retweet Count
								</TableCell>
								<TableCell sx={{ textAlign: "center" }}>
									Replied to Tweet ID
								</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Created At</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tweets.map((tweet) => (
								<TableRow key={tweet.tweet_id}>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.tweet_id}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.user_id}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.content}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.likes_count || 0}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.retweets_count || 0}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.replied_to_tweet_id || 0}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{tweet.created_at.substring(0, 10)}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										<IconButton onClick={() => handleOpenDialog("edit", tweet)}>
											<EditIcon color="primary" />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteTweet(tweet.tweet_id)}
										>
											<DeleteIcon color="error" />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					marginTop: "1rem",
				}}
			>
				<Button
					variant="contained"
					color="primary"
					onClick={() => handleOpenDialog("add")}
				>
					Add Tweet
				</Button>
			</Box>
			<Dialog open={showDialog} onClose={handleCloseDialog}>
				<DialogTitle>
					{dialogType === "add" ? "Add Tweet" : "Edit Tweet"}
				</DialogTitle>
				<DialogContent>
					<TextField
						margin="dense"
						label="ID"
						type="number"
						fullWidth
						value={idTweet}
						onChange={(e) => setIdTweet(e.target.value)}
						disabled={dialogType === "edit"}
					/>
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
