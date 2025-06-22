import { Request, Response } from "express";
import Task from "../models/task.model";
import { commonResponse } from "../utils/response";

export const createTask = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { taskName, description, dueDate } = req.body;

    const newTask = await Task.create({
      userId: user.userId,
      taskName,
      description,
      dueDate: new Date(dueDate),
    });

    commonResponse(res, 201, "SUCCESS", "Task created successfully", newTask);
  } catch (error: any) {
    commonResponse(res, 500, "ERROR", "Failed to create task", error.message);
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const tasks = await Task.find({ userId: user.userId }).sort({
      createdAt: -1,
    });

    commonResponse(res, 200, "SUCCESS", "Tasks fetched successfully", tasks);
  } catch (error: any) {
    commonResponse(res, 500, "ERROR", "Failed to fetch tasks", error.message);
  }
};

export const getTaskById = (req: Request, res: Response): void => {
  const user = (req as any).user;
  const taskId = req.params.id;

  Task.findOne({ _id: taskId, userId: user.userId })
    .then((task) => {
      if (!task) {
        commonResponse(res, 404, "FAILED", "Task not found");
        return;
      }
      commonResponse(res, 200, "SUCCESS", "Task fetched successfully", task);
    })
    .catch((error) => {
      commonResponse(res, 500, "ERROR", "Failed to fetch task", error.message);
    });
};

export const deleteTask = (req: Request, res: Response): void => {
  const user = (req as any).user;
  const taskId = req.params.id;

  Task.findOneAndDelete({ _id: taskId, userId: user.userId })
    .then((deletedTask) => {
      if (!deletedTask) {
        commonResponse(res, 404, "FAILED", "Task not found");
        return;
      }
      commonResponse(res, 200, "SUCCESS", "Task deleted successfully");
    })
    .catch((error) => {
      commonResponse(res, 500, "ERROR", "Failed to delete task", error.message);
    });
};
