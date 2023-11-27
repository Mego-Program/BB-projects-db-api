const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    req.parent = req.task || req.board;
    next();
});

router.all('/create', (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405);
    } else {
        next();
    }
});
router.post('/create', async (req, res) => {
    if (!req.body.title) {
        return res.status(400).json({ error: 'Comment must include title' });
    };
    try {
        req.parent.comments.push({
            title: req.body.title,
            content: req.body.content
        });
        await req.board.save();
        res.status(201).json(parent.comments[parent.comments.length - 1]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.all('/:commentId/read', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.sendStatus(405);
    } else {
        next();
    }
});
router.get('/:commentId/read', async (req, res) => {
    res.json(req.comment);
});

router.all('/:commentId/update', (req, res, next) => {
    if (req.method !== 'PUT') {
        res.sendStatus(405);
    } else {
        next();
    }
});
router.put('/:commentId/update', (req, res) => {
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
