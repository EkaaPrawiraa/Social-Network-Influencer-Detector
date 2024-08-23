import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import UserManagement from "./pages/UserManagement";
import TweetManagement from "./pages/TweetManagement";
import Header from "./components/Layout/Header";
import Dashboard from "./pages/Dashboard";
import Footer from "./components/Layout/Footer";
import GraphVisualization from "./pages/GraphVisualization";
import NotFound from "./pages/NotFound";
function HeaderWrapper() {
	const location = useLocation();
	return <Header page={location.pathname} />;
  }

function App() {
	const [userArray, setUserArray] = useState([]);
	const [tweetArray, setTweetArray] = useState([]);
	
	

	

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("http://localhost:5001/api/users");
				const users = response.data.map((user) => ({
					user_id: user.user_id,
					username: user.username,
					followers_count: user.followers_count ? user.followers_count : 0,
					joined_date: user.joined_date.substring(0, 10),
				}));

				setUserArray(users);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		const fetchTweets = async () => {
			try {
				const response = await axios.get("http://localhost:5001/api/tweets");
				const tweets = response.data.map((tweet) => ({
					tweet_id: tweet.tweet_id,
					user_id: tweet.user_id,
					content: tweet.content,
					likes_count: tweet.likes_count ? tweet.likes_count : 0,
					retweets_count: tweet.retweets_count ? tweet.retweets_count : 0,
					replied_to_tweet_id: tweet.replied_to_tweet_id
						? tweet.replied_to_tweet_id
						: 0,
					created_at: new Date(tweet.created_at).toISOString(),
				}));

				setTweetArray(tweets);
			} catch (error) {
				console.error("Error fetching time slots:", error);
			}
		};
		fetchTweets();
		fetchUsers();
	}, []);
	return (
		<Router>
			<HeaderWrapper/>
			<main>
				<Routes>
					<Route
						path="/users"
						element={<UserManagement SetUserArray={setUserArray} />}
					/>
					<Route
						path="/tweets"
						element={<TweetManagement setTweetArray={setTweetArray} />}
					/>
					<Route path="/" element={<Dashboard users={userArray} tweets={tweetArray} />} />
					<Route
						path="/graphvisual"
						element={
							<GraphVisualization users={userArray} tweets={tweetArray} />
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
			<Footer />
		</Router>
	);
};

export default App;
