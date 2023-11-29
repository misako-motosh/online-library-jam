import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./config/database.js";

const app = express();
const PORT = process.env.PORT || 8080;
const baseURL = "/api/v1";

dotenv.config();

connectDatabase();

app.use(cors());
app.use(express.json());

import orders from './routes/order.route.js';

app.use(`${baseURL}/orders`, orders);

app.get(`${baseURL}`, (request, response) => {
  response.status(200).send({ message: 'Hello' })
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));