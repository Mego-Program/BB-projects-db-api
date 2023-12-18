import dotenv from 'dotenv';
import { createConnection } from "mongoose";

dotenv.config({
  path: './.env'
});

const uri = process.env.DB_URI;

const dbConnection = createConnection(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dbConnection.on('error', console.error.bind(console, 'connection error:'));
dbConnection.once('open', function () {
  console.log('Connected to the database');
});

export default dbConnection;
