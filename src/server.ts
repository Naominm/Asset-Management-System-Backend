import express, { type Express } from "express";
import dotenv from "dotenv";
import { createAccessRequest } from "./controllers/access.Request.js";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/access-request", createAccessRequest);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
