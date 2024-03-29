import express from 'express';
const router = express.Router();
import { enforceGet, enforcePost, enforcePatch, enforceDelete } from '../utils/enforcers.js'
import taskRouter from './task.js'
import commentRouter from './comment.js'
import schemas from './schemas.js'
import dbConnection from "../connect.js";

const mongooseConnection = dbConnection;
mongooseConnection.model('Board', schemas.boardSchema);

const Board = mongooseConnection.model('Board');

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
    router.all('/create', enforcePost);
router.post('/create', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Board must include name' });
    };
    if (!req.body.description) {
        return res.status(400).json({ error: 'Board must include description' });
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
            users:[parseJwt(req.headers.authorization).userId],
            comments: []
        });
        await board.save();
        res.status(201).json(board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/readAll', async (req, res) => {
    try {
        let boards = await Board.find().select('id name').exec();
        
        res.json(boards);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

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
    try{
        req.board.users = req.body.users;
        req.board.save();
        res.json(req.board);
    } catch (error) {     
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function addUserToBoard(boardId, userId) {
    const board = await Board.findById(boardId);
    const index = board.users.indexOf(userId);

    if (index === -1) {
        board.users.push(userId);
        board.save(); 
    }
    return board;
}

async function removeUserFromBoard(boardId, userId) {
    const board = await Board.findById(boardId);
    const index = board.users.indexOf(userId);

    if (index !== -1) {
        board.users.splice(index, 1);
        await board.save(); 
    }
    return board;
}

router.patch('/:boardId/update/users/add', (req, res) => {
    const userId = req.body.userId;
    const boardId = req.params.boardId;
    try {
        const board = addUserToBoard(boardId, userId);
        res.json(board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:boardId/update/users/remove', async (req, res) => {
    const userId = req.body.userId;
    const boardId = req.params.boardId;

    try {
        const board = removeUserFromBoard(boardId, userId);
        res.json(board);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
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


router.use('/:boardId/task', taskRouter);

router.use('/:boardId/comment', commentRouter);

export {Board, router}
