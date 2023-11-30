const express = require('express');
const router = express.Router();
const statuses = require('./status').defaultStatuses;
const getStatus = require('./status').getStatus;
const checkUsers = require('../utils/checkUsers');
const enforcers = require('../utils/enforcers');

router.all('/create', enforcers.enforcePost);
router.post('/create', async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ error: 'Task must include name' });
    };
    if (!req.body.description) {
        res.status(400).json({ error: 'Task must include description' });
    };
    if (!checkUsers(req.body.users)) {
        res.status(400).json({ error: 'Task must include users as non-empty array of strings' });
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

router.all('/:taskId/read', enforcers.enforceGet);
router.get('/:taskId/read', (req, res) => {
    res.json(req.task);
});

router.use('/:taskId/update', enforcers.enforcePatch);
router.patch('/:taskId/update', async (req, res) => {
    try {
        req.task.name = req.body.name || req.task.name;
        req.task.description = req.body.description || req.task.description;
        req.board.save();
        res.json(req.task);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
        
router.patch('/:taskId/update/users', (req, res) => {
    if (!checkUsers(req.body.users)) {
        return res.status(400).json({ error: 'Users must be sent as non-empty array of strings' });
    };
    try {
        req.task.users = req.body.users;
        req.board.save();
        res.json(req.task);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

router.patch('/:taskId/update/status', async (req, res) => {
    try {
        req.task.status = await getStatus(req.body.status);
        await req.board.save();
        res.json(req.task);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.all('/:taskId/delete', enforcers.enforceDelete);
router.delete('/:taskId/delete', (req, res) => {
    try {
        req.task.deleteOne();
        req.board.save();
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    };
});

router.param('taskId', async (req, res, next, taskId) => {
    try {
        req.task = req.board.tasks.id(taskId);
        if (!req.task) {
            return res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    next();
});

router.use('/:taskId/comment', require('./comment'));

module.exports = router;