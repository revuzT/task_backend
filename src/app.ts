import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express, {
  Application,
  Request,
  RequestHandler,
  Response,
} from "express";
import authRouter from "./routes/auth.routes";
import { authenticate } from "./middleware.ts/auth.middleware";
import { commonResponse } from "./utils/response";
import taskRouter from "./routes/task.routes";

dotenv.config();
const app: Application = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Task Management Working");
});

const testHandler: RequestHandler = (req, res) => {
  commonResponse(
    res,
    200,
    "SUCCESS",
    "Protected route accessed successfully",
    (req as any).user
  );
};

app.get("/test", authenticate, testHandler);
app.use("/auth", authRouter);
app.use("/task", taskRouter);

export default app;
