import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTwitter } from "react-icons/fa";
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
import CloseIcon from "@mui/icons-material/Close";

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
				<b>User Management</b>
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
								<TableCell sx={{ textAlign: "center" }}>Username</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Followers</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Joined Date</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Actions</TableCell>
								<TableCell sx={{ textAlign: "center" }}>Total Tweets</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{users.map((user) => (
								<TableRow key={user.user_id}>
									<TableCell sx={{ textAlign: "center" }}>
										{user.user_id}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{user.username}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{user.followers_count || 0}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{user.joined_date.substring(0, 10)}
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										<IconButton onClick={() => handleOpenDialog("edit", user)}>
											<EditIcon color="primary" />
										</IconButton>
										<IconButton onClick={() => handleDeleteUser(user.user_id)}>
											<DeleteIcon color="error" />
										</IconButton>
									</TableCell>
									<TableCell sx={{ textAlign: "center" }}>
										{user.tweet_total}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>{" "}
				</TableContainer>{" "}
			</Box>{" "}
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
					Add User
				</Button>
			</Box>
			<Dialog open={showDialog} onClose={handleCloseDialog}>
				<DialogTitle>
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
					/>
					<TextField
						margin="dense"
						placeholder="Followers Count"
						type="number"
						fullWidth
						value={followersCount}
						onChange={(e) => setFollowersCount(e.target.value)}
					/>
					<TextField
						margin="dense"
						placeholder="Joined Date"
						type="date"
						fullWidth
						value={joinedDate}
						onChange={(e) => setJoinedDate(e.target.value)}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseDialog}>Cancel</Button>
					<Button onClick={handleSubmit}>Submit</Button>
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
