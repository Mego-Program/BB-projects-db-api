const express = require('express');
const router = express.Router();
const statuses = require('./status');

const db = require('../connect');
const Task = db.model('Task', require('./schemas').taskSchema);

router.all('/create', (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405);
    } else {
        next();
    }
});
router.post('/create', async (req, res) => {
    try {
        let task = new Task({
            name: req.body.name,
            description: req.body.description,
            status: await statuses.ToDo,
            board: req.body.board,
            users: req.body.users
        });
        task.populate('status');
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/read', (req, res) => {
    res.send('read task');
});

router.put('/update', (req, res) => {
    res.send('update task');
});

router.delete('/delete', (req, res) => {
    res.send('delete task');
});

module.exports = router;