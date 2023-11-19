const express = require('express');
const router = express.Router();

router.post('/create', (req, res) => {
    res.send('create task');
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