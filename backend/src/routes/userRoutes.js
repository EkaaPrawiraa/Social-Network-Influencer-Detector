const express = require('express');
const router = express.Router();
const users = require('../models/users');


router.get('/users', async (req, res) => {
    try {
        const allUsers = await users.getAll();
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.get('/userstweets', async (req, res) => {
    try {
        const allUsers = await users.getAllwithTweets();
        res.json(allUsers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


router.get('/users/:id', async (req, res) => {
    try {
        const user = await users.getById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});


router.post('/users', async (req, res) => {
    try {
        const { username, followers_count, joined_date } = req.body;
        console.log("new user", req.body);
        const newUser = await users.create(username, followers_count, joined_date);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create user' });
    }
});


router.put('/users/:id', async (req, res) => {
    try {
        const { username, followers_count, joined_date } = req.body;
        const updatedUser = await users.update(req.params.id, username, followers_count, joined_date);
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});


router.delete('/users/:id', async (req, res) => {
    try {
        const result = await users.delete(req.params.id);
        console.log(result[0].affectedRows);
        if (result[0].affectedRows > 0) {
            res.status(204).end(); 
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;