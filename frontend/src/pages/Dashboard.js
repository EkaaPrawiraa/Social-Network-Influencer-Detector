import {
	Box,
	Grid,
	Typography,
	Avatar,
	CircularProgress,
	Snackbar,
	Alert,
	IconButton,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import React, { useState, useEffect } from "react";
import calculateInfluenceFactor from "../utils/eigenvector";
import '@fontsource/playfair-display';

const Dashboard = ({ users, tweets }) => {
	const [eigenResult, setEigenResult] = useState([]);
	const [listTopUsers, setListTopUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	useEffect(() => {
		if (users.length !== 0 || tweets.length !== 0) {
			setEigenResult(calculateInfluenceFactor(users, tweets));
			setListTopUsers(
				users
					.sort(
						(user1, user2) =>
							(eigenResult[user2.user_id] || 0) -
							(eigenResult[user1.user_id] || 0)
					)
					.slice(0, 10)
			);
			setLoading(false);
		}
	}, [users, tweets]);

	const refresh = () => {
		setEigenResult(calculateInfluenceFactor(users, tweets));
		setListTopUsers(
			users
				.sort(
					(user1, user2) =>
						(eigenResult[user2.user_id] || 0) -
						(eigenResult[user1.user_id] || 0)
				)
				.slice(0, 10)
		);
		setLoading(false);
		setSnackbarMessage("The list successfully refreshed");
		setSnackbarSeverity("success");
		setSnackbarOpen(true);
	};

	const handleSnackbarClose = () => {
		setSnackbarOpen(false);
	};

	return (
		<Box
			sx={{
				maxWidth: "60%",
				margin: "auto",
				overflowY: "auto",
				"&::-webkit-scrollbar": {
					display: "none",
				},
				"-ms-overflow-style": "none",
				"scrollbar-width": "none",
			}}
		>
			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
					<CircularProgress />
				</Box>
			) : (
				<Grid container spacing={4}>
					{listTopUsers.map((user) => (
						<Grid item key={user.user_id} xs={12} sm={6} md={4} lg={3}>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									padding: 2,
									border: "1px solid #444", 
									borderRadius: 2,
									boxShadow: "0 4px 8px rgba(169, 169, 169, 0.5)", 
									background: "linear-gradient(135deg, #000000, #434343)",
									transition: "transform 0.3s, box-shadow 0.3s",
									"&:hover": {
										transform: "translateY(-5px)",
										boxShadow: "0 8px 16px rgba(211, 211, 211, 0.8)", 
									},
								}}
							>
								<Avatar
									src={`https://picsum.photos/200/300?random=${user.user_id}`}
									sx={{
										width: "60px",
										height: "60px",
										
										border: "2px solid #00a8cc",
										boxShadow: "0 0 15px rgba(0, 168, 204, 0.7)",
										transition: "box-shadow 0.3s ease-in-out",
										"&:hover": {
											boxShadow: "0 0 25px rgba(0, 168, 204, 1)",
										},
									}}
								/>
								<Typography variant="h6" sx={{ fontWeight: "bold", color:'white' ,fontFamily: "'Playfair Display', serif",}}>
									@{user.username}
								</Typography>
								<Typography variant="body2" sx={{ color: "#666" }}>
									Joined: {user.joined_date}
								</Typography>
								<Typography variant="body2" sx={{ color: "#666" }}>
									Followers: {user.followers_count}
								</Typography>
							</Box>
						</Grid>
					))}
					<IconButton
						onClick={refresh}
						style={{
							position: "absolute",
							top: "10px",
							right: "10px",
							color: "black",
                            backgroundColor:"white"
						}}
					>
						<RefreshIcon />
					</IconButton>
				</Grid>
			)}
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

export default Dashboard;
