import mongoose, { Document, Schema, Types } from "mongoose";

export interface TaskType extends Document {
  taskName: string;
  description?: string;
  dueDate: Date;
  createdAt: Date;
  userId: Types.ObjectId;
}

const TaskSchema: Schema = new Schema<TaskType>({
  taskName: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const Task = mongoose.model<TaskType>("Task", TaskSchema);

export default Task;
