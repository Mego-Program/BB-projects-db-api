const express = require('express');
const router = express.Router();
const enforcers = require('../utils/enforcers');

router.use((req, res, next) => {
    req.parent = req.task || req.board;
    next();
});

router.all('/create', enforcers.enforcePost);
router.post('/create', async (req, res) => {
    if (!req.body.user) {
        return res.status(400).json({ error: 'Creator user id required' });
    }
    if (!req.body.title) {
        return res.status(400).json({ error: 'Comment must include title' });
    };
    try {
        req.parent.comments.push({
            title: req.body.title,
            content: req.body.content,
            creator: req.body.user,
        });
        await req.board.save();
        res.status(201).json(req.parent.comments[req.parent.comments.length - 1]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.all('/:commentId/read', enforcers.enforceGet);
router.get('/:commentId/read', async (req, res) => {
    res.json(req.comment);
});

router.all('/:commentId/update', enforcers.enforcePatch);
router.patch('/:commentId/update', (req, res) => {
    req.comment.content = req.body.content;
    req.board.save();
    res.json(req.comment);
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
        req.comment = req.parent.comments.id(commentId);
        if (!req.comment) {
            return res.status(404).json({ error: 'Comment not found' });
        } else {
            next();
        };
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
