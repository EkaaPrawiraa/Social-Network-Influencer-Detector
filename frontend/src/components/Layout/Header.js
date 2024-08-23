import React from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
} from "@mui/material";
import { FaTwitter } from "react-icons/fa";

const Header = ({ page }) => {
	let sentence;
	switch (page) {
		case "/":
			sentence = "Top 10 Influencers";
			break;
		case "/users":
			sentence = "User Management Dashboard";
			break;
		case "/tweets":
			sentence = "Tweet Management Dashboard";
			break;
		case "/graphvisual":
			sentence = "Graph Visualization";
			break;
		default:
			sentence = "Social Network Influencer Detector";
	}

	return (
		<AppBar
			position="static"
			sx={{
				backgroundColor: "transparent",
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				padding: 1,
			}}
		>
			<Toolbar>
				<Box sx={{ flex: 2, textAlign: "center" }}>
					<Typography
						variant="h6"
						sx={{
							fontFamily: '"Anton", sans-serif',
							color: "white",
							fontSize: "1.5rem",
						}}
					>
                        <FaTwitter size={24} style={{ marginRight: 8 }} />
						<b>{sentence}</b>
					</Typography>
				</Box>
			</Toolbar>
		</AppBar>
	);
};

export default Header;
