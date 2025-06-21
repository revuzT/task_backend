import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";

dotenv.config();
const app: Application = express();
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Task Management Working");
});

export default app;
