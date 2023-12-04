import { Router } from 'express';
const router = Router();
import { enforcePost, enforceGet, enforcePatch, enforceDelete } from '../utils/enforcers';

router.use((req, res, next) => {
    req.parent = req.task || req.board;
    next();
});

router.all('/create', enforcePost);
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

router.all('/:commentId/read', enforceGet);
router.get('/:commentId/read', async (req, res) => {
    res.json(req.comment);
});

router.all('/:commentId/update', enforcePatch);
router.patch('/:commentId/update', (req, res) => {
    req.comment.content = req.body.content;
    req.board.save();
    res.json(req.comment);
});

router.all('/:commentId/delete', enforceDelete);
router.delete('/:commentId/delete', (req, res) => {
    try {
        req.comment.deleteOne();
        req.board.save();
        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }   
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


export default router;
