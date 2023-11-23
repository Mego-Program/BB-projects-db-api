const express = require('express');
const router = express.Router();
const statuses = require('./status');

router.all('/create', (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405);
    } else {
        next();
    }
});
router.post('/create', async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ error: 'Task must include name' });
    };
    if (!req.body.description) {
        res.status(400).json({ error: 'Task must include description' });
    };
    if (!req.body.users) {
        res.status(400).json({ error: 'Task must include users' });
    };
    try {
        const board = req.board;
        board.tasks.push({
            name: req.body.name,
            description: req.body.description,
            status: await statuses.Open,
            users: req.body.users
        });
        await board.save();
        res.status(201).send(board.tasks[board.tasks.length - 1]);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/read', (req, res) => {
    res.json(req.board);
});

router.put('/update', (req, res) => {
    res.send('update task');
});

router.delete('/delete', (req, res) => {
    res.send('delete task');
});

module.exports = router;