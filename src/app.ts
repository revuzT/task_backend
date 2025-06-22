import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import authRouter from "./routes/auth.routes";

dotenv.config();
const app: Application = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Task Management Working");
});

app.use("/auth", authRouter);

export default app;
