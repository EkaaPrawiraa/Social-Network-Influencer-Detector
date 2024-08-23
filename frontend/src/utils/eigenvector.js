function calculateInfluenceFactor(users, tweets) {
	const adjacencyMatrix = {};
	users.forEach((user) => {
		adjacencyMatrix[user.user_id] = {};
		users.forEach((otherUser) => {
			adjacencyMatrix[user.user_id][otherUser.user_id] = 0;
		});
	});
	tweets.forEach((tweet) => {
		const userId = tweet.user_id;
		const repliedToTweetId = tweet.replied_to_tweet_id
			? tweet.replied_to_tweet_id
			: null;
		if (repliedToTweetId) {
			const repliedToTweet = tweets.find(
				(t) => t.tweet_id === repliedToTweetId
			);
			if (repliedToTweet) {
				const repliedToUserId = repliedToTweet.user_id;
				adjacencyMatrix[repliedToUserId][userId] = 1;
			}
		}
	});
	const influenceFactors = {};
	users.forEach((user) => {
		const followersCount = user.followers_count;
		const joinedDate = new Date(user.joined_date).getTime();
		const tweetCount = tweets.filter(
			(tweet) => tweet.user_id === user.user_id
		).length;
		const likesReceived = tweets
			.filter((tweet) => tweet.user_id === user.user_id)
			.reduce((sum, tweet) => sum + (tweet.likes_count || 0), 0);
		const retweetsReceived = tweets
			.filter((tweet) => tweet.user_id === user.user_id)
			.reduce((sum, tweet) => sum + (tweet.retweets_count || 0), 0);
		const repliesReceived = tweets.filter(
			(tweet) => tweet.replied_to_tweet_id === user.user_id
		).length;

		const influenceFactor =
			0.1 * (followersCount ? followersCount : 0) +
			(0.1 * (new Date().getTime() - joinedDate)) /
				(1000 * 60 * 60 * 24 * 365) +
			0.1 * (tweetCount ? tweetCount : 0) +
			0.2 * (likesReceived ? likesReceived : 0) +
			0.2 * (retweetsReceived ? retweetsReceived : 0) +
			0.2 * (repliesReceived ? repliesReceived : 0) +
			0.1 *
				Object.values(adjacencyMatrix[user.user_id]).reduce(
					(sum, value) => sum + (value || 0),
					0
				);
		influenceFactors[user.user_id] = influenceFactor;
	});
	const eigenvectorValues = {};
	users.forEach((user) => {
		let sum = 0;
		Object.keys(adjacencyMatrix[user.user_id]).forEach((otherUserId) => {
			sum +=
				(adjacencyMatrix[user.user_id][otherUserId]
					? adjacencyMatrix[user.user_id][otherUserId]
					: 0) *
				(influenceFactors[otherUserId] ? influenceFactors[otherUserId] : 0);
		});

		eigenvectorValues[user.user_id] = sum;
	});
	const values = Object.values(eigenvectorValues);
	const min = Math.min(...values);
	const max = Math.max(...values);
	const normalizedEigenvectorValues = {};
	users.forEach((user) => {
		const value = eigenvectorValues[user.user_id];
		const normalizedValue = (value - min) / (max - min);
		normalizedEigenvectorValues[user.user_id] = normalizedValue;
	});
	return normalizedEigenvectorValues;
}

export default calculateInfluenceFactor;
