import express from 'express';
const router = express.Router();
import db from '../connect.js'
import checkUsers from '../utils/checkUsers.js'
import { enforceGet, enforcePost, enforcePatch, enforceDelete } from '../utils/enforcers.js'
import taskRouter from './task.js'
import commentRouter from './comment.js'
import schemas from './schemas.js'


const Board = db.model('Board',schemas.boardSchema)

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
        try {
            const validUserIds = dataAllUsers().map(user => user.id);
        
            body.users.forEach(user => {
                if (!validUserIds.includes(user.id)) {
                    return res.status(400).json({ error: 'There is an invalid user' });
                }
            });
                
        }catch (error) {
            console.error('Error during user validation:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }

        req.board.users = req.body.users;
        req.board.save();
        res.json(req.board);
    } catch (error) {     
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

function addUserToBoard(board, userId) {
    const allUserIds = dataAllUsers().map(user => user.id);
    const index = board.users.indexOf(userId);

    if (index === -1 && allUserIds.includes(userId)) {
        board.users.push(userId);
        board.save(); 
    }
    return board;
}

function removeUserFromBoard(board, userId) {
    const index = board.users.indexOf(userId);

    if (index !== -1) {
        board.users.splice(index, 1);
        board.save(); 
    }

    return board;
}

router.patch('/:boardId/update/users/:userId/add', (req, res) => {
    const { boardId, userId } = req.params;

    if (!checkUsers(req.body.users)) {
        return res.status(400).json({ error: 'Users must be sent as a non-empty array of strings' });
    }

    try {
        addUserToBoard(req.board, userId);
        res.json(req.board);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.patch('/:boardId/update/users/:userId/remove', (req, res) => {
    const { boardId, userId } = req.params;

    if (!checkUsers(req.body.users)) {
        return res.status(400).json({ error: 'Users must be sent as a non-empty array of strings' });
    }
    if (!(userId in dataAllUsers().id) ){
        return res.status(400).json({ error: 'Unvalid user.' });
    }
    try {
        removeUserFromBoard(req.board, userId);
        res.json(req.board);
    } catch (error) {
       return  res.status(500).json({ error: 'Internal Server Error' });
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

export {router, checkUsers}