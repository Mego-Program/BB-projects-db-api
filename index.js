
import express, { json } from 'express';
import { router as boardRouter } from './models/board.js';
import { usersRouter} from './models/users.js';
import cors from "cors";

const app = express();
app.use(cors());

// Authentication middleware
//<<<<<<< users-api
//import axios from 'axios';
//=======
//const axios = require('axios');
//>>>>>>> main

// app.use((req, res, next) => {
//     // // Call the auth API to authenticate the request
//     // axios.post('https://example.com/auth', {
//     //     token: req.headers.usertoken // Assuming the token is passed in the request headers
//     // })
//     // .then(response => {
//     //     // If authentication is successful, call next() to proceed to the next middleware or route handler
//     //     next();
//     // })
//     // .catch(error => {
//     //     // If authentication fails, return an error response
//     //     res.status(401).json({ error: 'Unauthorized' });
//     // });
//     // if (req.headers.authorization) {
//     //     req.user = req.headers.authorization
//     //     next();
//     // } else {
//     //     res.status(401).json({ error: 'Unauthorized' });
//     // }
// });



app.use(json());
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
});

app.use('/board', boardRouter);
app.use('/users', usersRouter);

export default app
