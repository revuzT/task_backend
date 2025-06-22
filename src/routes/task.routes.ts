import express from "express";
import { authenticate } from "../middleware.ts/auth.middleware";
import { validate } from "../middleware.ts/validate.middleware";
import { taskSchema } from "../validators/task.validator";
import {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
} from "../controller/task.controller";

const taskRouter = express.Router();

taskRouter.post("/", authenticate, validate(taskSchema), createTask);
taskRouter.get("/", authenticate, getAllTasks);
taskRouter.get("/:id", authenticate, getTaskById);
taskRouter.delete("/:id", authenticate, deleteTask);

export default taskRouter;
