const db = require('../config/database');

const users = {
    async getAll() {
        const [result] = await db.query('SELECT * FROM Users');
        return result;
    },

    async getAllwithTweets(){
        const [result] = await db.query('SELECT Users.*, COUNT(Tweets.tweet_id) AS tweet_count FROM Users LEFT JOIN Tweets ON Users.user_id = Tweets.user_id GROUP BY Users.user_id');
        return result;
    },

    async getById(id) {
        const [result] = await db.query('SELECT * FROM Users WHERE user_id = ?', [id]);
        return result[0];
    },

    async create(username, followers_count, joined_date) {
        const [result] = await db.query(
            'INSERT INTO Users (username, followers_count, joined_date) VALUES (?, ?, ?)',
            [username, followers_count, joined_date]
        );
        return this.getById(result.insertId);
    },

    async update(id, username, followers_count, joined_date) {
        await db.query(
            'UPDATE Users SET username = ?, followers_count = ?, joined_date = ? WHERE user_id = ?',
            [username, followers_count, joined_date, id]
        );
        return this.getById(id);
    },

    async delete(id) {
        const result = await db.query('DELETE FROM Users WHERE user_id = ?', [id]);
        return result;
    }
};

module.exports = users;