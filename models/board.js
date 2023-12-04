import { Router } from 'express'
const router = Router()
import { model } from '../connect'
import checkUsers from '../utils/checkUsers'
import { enforceGet, enforcePost, enforcePatch, enforceDelete } from '../utils/enforcers'

const Board = model('Board', require('./schemas').default.boardSchema)

router.all('/user/:userId/read', enforceGet);
router.get('/user/:userId/read', async (req, res) => {
    try {
        let boards = await Board.find({ users: req.params.userId }).populate({path: 'tasks.status', select: 'name'}).exec();
        res.json(boards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.all('/create', enforcePost);
router.post('/create', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Board must include name' });
    };
    if (!req.body.description) {
        return res.status(400).json({ error: 'Board must include description' });
    };
    if (!checkUsers(req.body.users)) {
        return res.status(400).json({ error: 'Users must be sent as non-empty array of strings' });
    };
    if (req.body.isSprint && !req.body.sprintLength) {
        return res.status(400).json({ error: 'Sprint must include sprintLength in minutes' });
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


router.all('/:boardId/read', enforceGet);
router.get('/:boardId/read', async (req, res) => {
    try {
        res.json(req.board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.use('/:boardId/update', enforcePatch);
router.patch('/:boardId/update', async (req, res) => {
    try {
        req.board.name = req.body.name || req.board.name;
        req.board.description = req.body.description || req.board.description;
        await req.board.save();
        res.json(req.board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:boardId/update/users', (req, res) => {
    if (!checkUsers(req.body.users)) {
        return res.status(400).json({ error: 'Users must be sent as non-empty array of strings' });
    };
    try {
        req.board.users = req.body.users;
        req.board.save();
        res.json(req.board);
    } catch (error) {     
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.all('/:boardId/delete', enforceDelete);
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
        req.board = await Board.findById(boardId).populate({path: 'tasks.status', select: 'name'}).exec();
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


router.use('/:boardId/task', require('./task').default);

router.use('/:boardId/comment', require('./comment').default);

export default {router, checkUsers}