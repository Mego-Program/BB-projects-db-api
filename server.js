const cors = require('cors')
const express = require('express');
const app = express();
const port = 3000;
const boardRouter = require('./models/board').router;

// Authentication middleware
const axios = require('axios');
app.use(cors());


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
    if (req.headers.authorization) {
        req.user = req.headers.authorization
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
});

app.use(express.json());
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
});

app.use('/board', boardRouter);

// possible future feature: create custom statuses
// app.use('/status', statusRouter);