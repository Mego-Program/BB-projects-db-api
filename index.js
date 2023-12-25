
import express, { json } from 'express';
import { router as boardRouter } from './models/board.js';
import { usersRouter} from './models/users.js';
import cors from "cors";

const app = express();
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello Projects-Bnei-Brak Team! This is our Express server.');
});


app.use(json());
app.use((req, res, next) => {
    console.log(req.method + ' ' + req.path);
    next();
});

app.use('/board', boardRouter);
app.use('/users', usersRouter);

export default app
