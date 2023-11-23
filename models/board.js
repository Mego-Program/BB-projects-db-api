const express = require('express')
const router = express.Router()
const db = require('../connect')

const Board = db.model('Board', require('./schemas').boardSchema)

router.all('/create', (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.post('/create', async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ error: 'Board must include name' });
    };
    if (!req.body.description) {
        res.status(400).json({ error: 'Board must include description' });
    };
    if (!req.body.users) {
        res.status(400).json({ error: 'Board must include users' });
    };
    if (req.body.isSprint && !req.body.sprintLength) {
        res.status(400).json({ error: 'Sprint must include sprintLength in minutes' });
    };
    try {
        const board = new Board({
            name: req.body.name,
            description: req.body.description,
            isSprint: req.body.isSprint,
            endDate: req.body.isSprint ? Date.now() + (req.body.sprintLength * 60 * 1000) : null,
            users: req.body.users,
        });
        await board.save();
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.all('/:boardId/read', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.get('/:boardId/read', async (req, res) => {
    try {
        res.json(req.board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.all('/:boardId/update', (req, res, next) => {
    if (req.method !== 'PUT') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.put('/:boardId/update', async (req, res) => {
    try {
        req.board.name = req.body.name || req.board.name;
        req.board.description = req.body.description || req.board.description;
        await req.board.save();
        res.json(req.board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.all('/:boardId/update/users', (req, res, next) => {
    if (req.method !== 'PUT') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.put('/:boardId/update/users', (req, res) => {
    if (!req.body.users) {
        res.status(400).json({ error: 'Board must include users' });
    };
    try {
        req.board.users = req.body.users;
        req.board.save();
        res.json(req.board);
    } catch (error) {     
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.all('/:boardId/delete', (req, res, next) => {
    if (req.method !== 'DELETE') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.delete('/:boardId/delete', async (req, res) => {
    try {
        let del = await Board.findByIdAndDelete(req.board._id).exec();
        res.json(del);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.param('boardId', async (req, res, next, boardId) => {
    try {
        req.board = await Board.findById(boardId).exec();
        if (!req.board) {
            res.status(404).json({ error: 'Board not found' });
        } else {
            next()
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({ error: 'Board not found' });
    };
});


router.use('/:boardId/task', require('./task'))

module.exports = router