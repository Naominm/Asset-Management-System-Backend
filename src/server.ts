import express, { type Express } from "express";
import dotenv from "dotenv";
import {
  createAccessRequest,
  approveAccessRequest,
} from "./controllers/access.controller.js";
import assignmentRoutes from "./routes/assignment.routes.js";
import authRoutes from "./routes/auth.route.js";
import assetRoutes from "./routes/asset.routes.js";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use("/access-request", createAccessRequest);
app.use("/approve-request", approveAccessRequest);
app.use("/asset", assetRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
