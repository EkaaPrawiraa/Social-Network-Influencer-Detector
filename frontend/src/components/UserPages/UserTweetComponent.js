import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TextField,
    IconButton,
    Typography,
} from '@mui/material';
import { Save as SaveIcon, Edit as EditIcon } from '@mui/icons-material';

const UserTweetDialog = ({ open, onClose, userId, fetchTweetsUser, updateTweet }) => {
    const [tweets, setTweets] = useState([]);
    const [editTweetId, setEditTweetId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    useEffect(() => {
        if (open && userId) {
            const fetchData = async () => {
                const fetchedTweets = await fetchTweetsUser(userId);
                setTweets(fetchedTweets);
            };
            fetchData();
        }
    }, [open, userId, fetchTweetsUser]);

    const handleEditClick = (tweet) => {
        setEditTweetId(tweet.tweet_id);
        setEditedContent(tweet.content);
    };

    const handleSaveClick = async (tweetId) => {
        await updateTweet(tweetId, editedContent);
        setTweets(tweets.map(tweet =>
            tweet.tweet_id === tweetId ? { ...tweet, content: editedContent } : tweet
        ));
        setEditTweetId(null);
        setEditedContent('');
    };

    const handleCancelClick = () => {
        setEditTweetId(null);
        setEditedContent('');
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogTitle>User Tweets</DialogTitle>
            <DialogContent>
                {tweets.length === 0 ? (
                    <Typography>No tweets found for this user.</Typography>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tweet ID</TableCell>
                                <TableCell>Content</TableCell>
                                <TableCell>Likes</TableCell>
                                <TableCell>Retweets</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tweets.map((tweet) => (
                                <TableRow key={tweet.tweet_id}>
                                    <TableCell>{tweet.tweet_id}</TableCell>
                                    <TableCell>
                                        {editTweetId === tweet.tweet_id ? (
                                            <TextField
                                                fullWidth
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                            />
                                        ) : (
                                            tweet.content
                                        )}
                                    </TableCell>
                                    <TableCell>{tweet.likes_count}</TableCell>
                                    <TableCell>{tweet.retweets_count}</TableCell>
                                    <TableCell>
                                        {new Date(tweet.created_at).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        {editTweetId === tweet.tweet_id ? (
                                            <>
                                                <IconButton
                                                    onClick={() => handleSaveClick(tweet.tweet_id)}
                                                    color="primary"
                                                >
                                                    <SaveIcon />
                                                </IconButton>
                                                <Button onClick={handleCancelClick}>Cancel</Button>
                                            </>
                                        ) : (
                                            <IconButton
                                                onClick={() => handleEditClick(tweet)}
                                                color="primary"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserTweetDialog;