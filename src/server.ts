import express, { type Express } from "express";
import dotenv from "dotenv";

dotenv.config();
const app: Express = express();
const port = process.env.port || 5000;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
