const express = require('express');
const router = express.Router();
const tweets = require('../models/tweets');

router.get('/tweets', async (req, res) => {
    try {
        const allTweets = await tweets.getAll();
        res.json(allTweets);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tweets' });
    }
});


router.get('/tweets/:id', async (req, res) => {
    try {
        const tweet = await tweets.getById(req.params.id);
        if (tweet) {
            res.json(tweet);
        } else {
            res.status(404).json({ error: 'Tweet not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tweet' });
    }
});


router.get('/tweets/user/:user_id', async (req, res) => {
    try {
        const tweet = await tweets.getByUserId(req.params.user_id);
        if (tweet) {
            res.json(tweet);
        } else {
            res.status(404).json({ error: 'Tweet not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tweet' });
    }
});


router.post('/tweets', async (req, res) => {
    try {
        const { tweet_id,user_id, content, likes_count,retweets_count, replied_to_tweet_id,created_at } = req.body;
        console.log(req.body);
        const newTweet = await tweets.create(tweet_id, user_id, content, likes_count,retweets_count, replied_to_tweet_id,created_at);
        res.status(201).json(newTweet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create tweet' });
    }
});

router.put('/tweets/:id', async (req, res) => {
    try {
        const { user_id,content, likes_count, retweets_count,replied_to_tweet_id } = req.body;
        console.log(req.body)
        
        const updatedTweet = await tweets.update(req.params.id, user_id, content, likes_count, retweets_count,replied_to_tweet_id);
        res.json(updatedTweet);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update tweet' });
    }
});


router.delete('/tweets/:id', async (req, res) => {
    try {
        const result = await tweets.delete(req.params.id);
        if (result[0].affectedRows > 0) {
            res.status(204).end();  
        } else {
            res.status(404).json({ error: 'Tweet not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete tweet' });
    }
});

module.exports = router;
