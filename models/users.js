import express from 'express';
import { allUsers, inUsers, exUsers, selfUser } from './servicesUsers.js';

const router = express.Router();

router.get('/self', async (req, res) => {
  try {
    const token = req.headers.authorization;
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
    const result = await allUsers(token);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/in', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const usersList = req.query.idsArray; // Change to query parameters
    const result = await inUsers(token, usersList);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/ex', async (req, res) => {
  try {
    const token = req.headers.authorization;
    const usersList = req.query.idsArray; // Change to query parameters
    const result = await exUsers(token, usersList);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export { router as usersRouter };
