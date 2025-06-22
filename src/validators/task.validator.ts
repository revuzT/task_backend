import { z } from "zod";

export const taskSchema = z.object({
  taskName: z
    .string({ required_error: "Task name is required" })
    .min(1, "Task name is required"),

  description: z.string().optional(),

  dueDate: z
    .string({ required_error: "Due date is required" })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});
