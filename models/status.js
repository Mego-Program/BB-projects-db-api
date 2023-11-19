const express = require('express');
const router = express.Router();
const db = require('../connect');

const Status = db.model('Status', require('./schemas').statusSchema);

router.all('/create', (req, res, next) => {
    if (req.method !== 'POST') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.post('/create', async (req, res) => {
    try {
        const status = new Status({
            name: req.body.name,
            description: req.body.description
        });
        await status.save();
        res.status(201).json(status);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the status' });
    }
});

router.all('/read', (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.get('/read', (req, res) => {
    res.send('read status');
});

router.all('/update', (req, res, next) => {
    if (req.method !== 'PUT') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.put('/update', (req, res) => {        
    res.send('update status');
});

router.all('/delete', (req, res, next) => {
    if (req.method !== 'DELETE') {
        res.sendStatus(405)
    } else {
        next()
    }
});
router.delete('/delete', (req, res) => {
    res.send('delete status');
});

module.exports = router;