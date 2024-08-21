import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import UserManagement from "./pages/UserManagement";
import TweetManagement from "./pages/TweetManagement";

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
					followers_count: user.followers_count,
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
					likes_count: tweet.likes_count,
					retweets_count: tweet.retweets_count,
					replied_to_tweet_id: (tweet.replied_to_tweet_id ? tweet.replied_to_tweet_id : tweet.tweet_id ),
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
			<Routes>
				<Route
					path="/users"
					element={<UserManagement SetUserArray={setUserArray} />}
				/>
        <Route path="/tweets" element={<TweetManagement setTweetArray={setTweetArray}/>}/>
			</Routes>
		</Router>
	);
}

export default App;
