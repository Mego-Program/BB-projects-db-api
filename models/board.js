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
    const board = new Board({
        name: req.body.name,
    });
    await board.save();
    console.log('board.id: ', board.id);
    res.send('create board');
});


router.all('/read', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.get('/read', async (req, res) => {
    try {
        const boards = await Board.find().exec();
        res.json(boards);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.all('/update', (req, res, next) => {
    if (req.method !== 'PUT') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.put('/update', (req, res) => {
    res.send('update board')
});

router.all('/delete', (req, res, next) => {
    if (req.method !== 'DELETE') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.delete('/delete', (req, res) => {
    res.send('delete board')
});

router.param('boardId', async (req, res, next, boardId) => {
    try {
        req.board = await Board.findById(boardId).exec();
        next()
    } catch (error) {
        res.status(404).json({ error: 'Board not found' });
    };
});


router.use('/:boardId/task', require('./task'))

module.exports = router