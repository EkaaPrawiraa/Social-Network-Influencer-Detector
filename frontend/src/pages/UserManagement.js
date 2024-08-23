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
	Card,
	CardContent,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import '@fontsource/roboto'; 
import '@fontsource/playfair-display'; 
import '@fontsource/open-sans'; 
import '@fontsource/lora'; 
import '@fontsource/montserrat';

const UserManagement = ({ SetUserArray }) => {
	const [users, setUsers] = useState([]);
	const [idUser, setIdUser] = useState("");
	const [username, setUsername] = useState("");
	const [joinedDate, setJoinedDate] = useState("");
	const [followersCount, setFollowersCount] = useState("");
	const [editingUser, setEditingUser] = useState(null);
	const [showDialog, setShowDialog] = useState(false);
	const [dialogType, setDialogType] = useState("add");
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		if (SetUserArray) {
			const newUsers = users.map((user) => ({
				user_id: user.user_id,
				username: user.username,
				followers_count: user.followers_count,
				joined_date: user.joined_date.substring(0, 10),
			}));
			SetUserArray(newUsers);
		}
	}, [users, SetUserArray]);

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:5001/api/userstweets");
			setUsers(
				response.data.map((user) => ({
					user_id: user.user_id,
					username: user.username,
					followers_count: user.followers_count,
					joined_date: user.joined_date.substring(0, 10),
					tweet_total: user.tweet_count,
				}))
			);
		} catch (error) {
			console.error("Error fetching users:", error);
			setSnackbarMessage("Error fetching users");
			setSnackbarSeverity("error");
			setSnackbarOpen(true);
		}
	};

	const handleOpenDialog = (type, user = null) => {
		setDialogType(type);
		setEditingUser(user);
		if (type === "edit" && user) {
			setIdUser(user.user_id);
			setUsername(user.username);
			setFollowersCount(user.followers_count);
			setJoinedDate(user.joined_date.substring(0, 10));
		} else {
			setIdUser("");
			setUsername("");
			setJoinedDate("");
			setFollowersCount("");
		}
		setShowDialog(true);
	};

	const handleCloseDialog = () => {
		setShowDialog(false);
		setEditingUser(null);
	};

	const handleSubmit = async () => {
		if (dialogType === "add") {
			try {
				const response = await axios.post("http://localhost:5001/api/users", {
					username: username,
					followers_count: followersCount,
					joined_date: joinedDate,
				});
				setUsers([...users, response.data]);
				setSnackbarMessage("User added successfully");
				setSnackbarSeverity("success");
			} catch (error) {
				console.error("Error adding user:", error);
				setSnackbarMessage("Error adding user");
				setSnackbarSeverity("error");
			}
		} else if (dialogType === "edit" && editingUser) {
			try {
				const response = await axios.put(
					`http://localhost:5001/api/users/${editingUser.user_id}`,
					{
						username: username,
						followers_count: followersCount,
						joined_date: joinedDate,
					}
				);
				setUsers(
					users.map((u) =>
						u.user_id === response.data.user_id ? response.data : u
					)
				);
				setSnackbarMessage("User updated successfully");
				setSnackbarSeverity("success");
			} catch (error) {
				console.error("Error updating user:", error);
				setSnackbarMessage("Error updating user");
				setSnackbarSeverity("error");
			}
		}
		handleCloseDialog();
		setSnackbarOpen(true);
	};

	const handleDeleteUser = async (id) => {
		try {
			await axios.delete(`http://localhost:5001/api/users/${id}`);
			setUsers(users.filter((user) => user.user_id !== id));
			setSnackbarMessage("User deleted successfully");
			setSnackbarSeverity("success");
		} catch (error) {
			console.error("Error deleting user:", error);
			setSnackbarMessage("Error deleting user");
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
				// background: "linear-gradient(135deg, #000000, #434343)",
				borderRadius: "12px",
				boxShadow: "0 8px 16px rgba(0, 0, 0, 0.5)",
				maxWidth: "100%",
				margin: "auto",
				"&::-webkit-scrollbar": {
					display: "none",
				},
				"-ms-overflow-style": "none",
				"scrollbar-width": "none",
				transition: "background 0.3s ease-in-out",
			}}
		>
			<Box
				sx={{
					overflowY: "auto",
					maxHeight: "70vh",
					"&::-webkit-scrollbar": {
						display: "none",
					},
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				}}
			>
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
						gap: "1rem",
					}}
				>
					{users.map((user) => (
						<Card
							key={user.user_id}
							sx={{
								background: "linear-gradient(135deg, #000000, #434343)",
								color: "#f5f5f5",
								borderRadius: "12px",
								boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
								transition: "transform 0.3s ease-in-out",
								"&:hover": {
									transform: "scale(1.03)",
								},
							}}
						>
							<CardContent>
								<Typography
									variant="h6"
									component="div"
									sx={{
										fontWeight: "bold",
										fontFamily: "'Playfair Display', serif",
									}}
								>
									@{user.username}
								</Typography>
								<Typography
									sx={{
										mb: 1.5,
										fontFamily: "'Open Sans', sans-serif",
										color: "grey",
									}}
								>
									ID: {user.user_id}
								</Typography>
								<Typography sx={{ mb: 1.5, fontFamily: "'Lora', serif" }}>
									Followers:{" "}
									{user.followers_count
										? formatNumber(user.followers_count)
										: 0}
								</Typography>
								<Typography
									sx={{ mb: 1.5, fontFamily: "'Montserrat', sans-serif" }}
								>
									Joined Date: {user.joined_date.substring(0, 10)}
								</Typography>
								<Typography sx={{ fontFamily: "'Roboto', sans-serif" }}>
									Total Tweets: {user.tweet_total ? user.tweet_total : 0}
								</Typography>
							</CardContent>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									p: 1,
									borderTop: "1px solid #333",
								}}
							>
								<IconButton
									onClick={() => handleOpenDialog("edit", user)}
									aria-label="Edit"
									sx={{
										color: "#8f8582",
										"&:hover": {
											color: "#ffff",
										},
									}}
								>
									<EditIcon />
								</IconButton>
								<IconButton
									onClick={() => handleDeleteUser(user.user_id)}
									aria-label="Delete"
									sx={{
										color: "#730d1c",
										"&:hover": {
											color: "#cc141e",
										},
									}}
								>
									<DeleteIcon />
								</IconButton>
							</Box>
						</Card>
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
			</Box>

			<Dialog open={showDialog} onClose={handleCloseDialog}>
				<DialogTitle sx={{ color: "#6d28d9" }}>
					{dialogType === "edit" ? "Edit User" : "Add User"}
				</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						placeholder="Username"
						type="text"
						fullWidth
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						sx={{ color: "#333" }}
					/>
					<TextField
						margin="dense"
						placeholder="Followers Count"
						type="number"
						fullWidth
						value={followersCount}
						onChange={(e) => setFollowersCount(e.target.value)}
						sx={{ color: "#333" }}
					/>
					<TextField
						margin="dense"
						placeholder="Joined Date"
						type="date"
						fullWidth
						value={joinedDate}
						onChange={(e) => setJoinedDate(e.target.value)}
						sx={{ color: "#333" }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog} sx={{ color: "#d946ef" }}>
						Cancel
					</Button>
					<Button onClick={handleSubmit} sx={{ color: "#6d28d9" }}>
						Submit
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={snackbarOpen}
				autoHideDuration={6000}
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

export default UserManagement;
