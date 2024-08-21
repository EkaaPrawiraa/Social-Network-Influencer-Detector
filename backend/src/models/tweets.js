const db = require('../config/database');

const tweets = {
    async getAll() {
        const [result] = await db.query('SELECT * FROM Tweets');
        return result;
    },

    async getById(tweet_id) {
        const [result] = await db.query('SELECT * FROM Tweets WHERE tweet_id = ?', [tweet_id]);
        return result[0];
    },

    async getByUserId(user_id) {
        const [result] = await db.query('SELECT * FROM Tweets WHERE user_id = ?', [user_id]);
        console.log(result);
        console.log("Result : ",result[0]);
        return result;
    },

    async create(tweet_id,user_id, content, likes_count, retweets_count,replied_to_tweet_id,created_at) {
        const [result] = await db.query(
            'INSERT INTO Tweets (tweet_id,user_id, content, likes_count, retweets_count,replied_to_tweet_id,created_at) VALUES (?, ?, ?, ?,?,?,?)',
            [tweet_id,user_id, content, likes_count, retweets_count,replied_to_tweet_id,created_at]
        );
        
        return this.getById(result.insertId);
    },

    async update(tweet_id,user_id, content, likes_count, retweets_count,replied_to_tweet_id ) {
        // console.log(tweet_id,user_id, content, likes_count, retweets_count,replied_to_tweet_id)
        await db.query(
            'UPDATE Tweets SET user_id = ?, content = ?, likes_count = ?, retweets_count = ?, replied_to_tweet_id = ? WHERE tweet_id = ?',
            [user_id,content, likes_count, retweets_count,replied_to_tweet_id, tweet_id]
        );
        // console.log(this.getById(tweet_id));
        return this.getById(tweet_id);
    },

    async delete(tweet_id) {
        const result = await db.query('DELETE FROM Tweets WHERE tweet_id = ?', [tweet_id]);
        return result;
    }
};

module.exports = tweets;