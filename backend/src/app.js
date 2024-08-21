const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const app = express();
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true, 
    optionsSuccessStatus: 200 
};

connectDB.getConnection()
    .then(() => console.log('Masokk'))
    .catch(err => console.error('Error euy', err));

app.use(cors(corsOptions));
app.use(express.json()); 





app.use('/api', userRoutes);

app.use('/api', tweetRoutes);


module.exports = app;