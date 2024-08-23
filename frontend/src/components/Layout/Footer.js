import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import PersonIcon from "@mui/icons-material/Person";
import TwitterIcon from "@mui/icons-material/Twitter";
import EqualizerIcon from "@mui/icons-material/Equalizer";

const Footer = () => {
	return (
		<AppBar
			position="static"
			sx={{
				top: "auto",
				bottom: 0,
				padding: 1,
				background: "transparent",
				borderTop: "2px solid",
			}}
		>
			<Toolbar
				sx={{
					justifyContent: "space-between",
					padding: 2,
				}}
			>
				<Button
					component={Link}
					to="/users"
					sx={{
						fontFamily: '"Anton", sans-serif',
						color: "white",
						fontSize: "1.5rem",
						padding: "1rem 2rem",
					}}
				>
					<PersonIcon sx={{ fontSize: "2rem", color: "white" }} />
				</Button>
				<Button
					component={Link}
					to="/tweets"
					sx={{
						fontFamily: '"Anton", sans-serif',
						color: "white",
						fontSize: "1.5rem",
						padding: "1rem 2rem",
					}}
				>
					<TwitterIcon sx={{ fontSize: "2rem", color: "white" }} />
				</Button>
				<Button
					component={Link}
					to="/"
					sx={{
						fontFamily: '"Anton", sans-serif',
						color: "white",
						fontSize: "1.5rem",
						padding: "1rem 2rem",
					}}
				>
					<GridViewIcon sx={{ fontSize: "2rem", color: "white" }} />
				</Button>
				<Button
					component={Link}
					to="/graphvisual"
					sx={{
						fontFamily: '"Anton", sans-serif',
						color: "white",
						fontSize: "1.5rem",
						padding: "1rem 2rem",
					}}
				>
					<EqualizerIcon sx={{ fontSize: "2rem", color: "white" }} />
				</Button>
			</Toolbar>
		</AppBar>
	);
};

export default Footer;
