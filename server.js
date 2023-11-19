
const express = require('express');
const app = express();
const port = 3000;
const boardRouter = require('./models/board');
const taskRouter = require('./models/task');
const statusRouter = require('./models/status');

// Authentication middleware
const axios = require('axios');

app.use((req, res, next) => {
    // // Call the auth API to authenticate the request
    // axios.post('https://example.com/auth', {
    //     token: req.headers.usertoken // Assuming the token is passed in the request headers
    // })
    // .then(response => {
    //     // If authentication is successful, call next() to proceed to the next middleware or route handler
    //     next();
    // })
    // .catch(error => {
    //     // If authentication fails, return an error response
    //     res.status(401).json({ error: 'Unauthorized' });
    // });
    if (req.headers.usertoken) {
        req.user = req.headers.usertoken
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

app.use(express.json());

app.use('/board', boardRouter);
app.use('/task', taskRouter);
app.use('/status', statusRouter);