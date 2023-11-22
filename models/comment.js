const express = require('express');
const router = express.Router();
const db = require('../connect');

const Comment = db.model('Comment', require('./schemas').commentSchema);

router.all('/create', (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405);
    } else {
        next();
    }
});

router.post('/create', async (req, res) => {
    try {
        const comment = new Comment({
            title: req.body.title,
            text: req.body.text
        });
        await comment.save();
        console.log('comment.id: ', comment.id);
        res.send('create comment');
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.all('/read', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.sendStatus(405);
    } else {
        next();
    }
});

router.get('/read', async (req, res) => {
    try {
        const comments = await Comment.find().exec();
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.all('/update', (req, res, next) => {
    if (req.method !== 'PUT') {
        res.sendStatus(405);
    } else {
        next();
    }
});

router.put('/update', (req, res) => {
    res.send('update comment');
});

router.all('/delete', (req, res, next) => {
    if (req.method !== 'DELETE') {
        res.sendStatus(405);
    } else {
        next();
    }
});

router.delete('/delete', (req, res) => {
    res.send('delete comment');
});

router.param('commentId', async (req, res, next, commentId) => {
    try {
        req.comment = await Comment.findById(commentId).exec();
        next();
    } catch (error) {
        res.status(404).json({ error: 'comment not found' });
    }
});

router.use('/:commentId/task', require('./task'));

module.exports = router;
