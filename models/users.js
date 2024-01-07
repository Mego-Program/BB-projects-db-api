import express from 'express';
import { allUsers, inUsers, exUsers, selfUser } from '../utils/servicesUsers.js';

const router = express.Router();

router.get('/self', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token Missing' });
    }
    const result = await selfUser(token);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token Missing' });
    }
    const result = await allUsers(token);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/in', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token Missing' });
    }
    const boardID = req.body.boardID;
    console.log(boardID); 
    const result = await inUsers(token, boardID);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/ex', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - Token Missing' });
    }
    const boardID = req.body.boardID;
    const result = await exUsers(token, boardID);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router as usersRouter };
