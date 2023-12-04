import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDatabase from './config/database.js';
import users from './routes/user.route.js';
import books from './routes/book.route.js';
import orders from './routes/order.route.js';

const app = express();
const PORT = process.env.PORT || 8080;
const baseURL = '/api/v1';

dotenv.config();

connectDatabase();

app.use(cors());
app.use(express.json());


app.use(`${baseURL}/books`, books)
app.use(`${baseURL}/users`, users);
app.use(`${baseURL}/orders`, orders);

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));