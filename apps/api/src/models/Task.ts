import mongoose, { type InferSchemaType } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["TODO", "DOING", "DONE"], default: "TODO" },
    priority: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], default: "MEDIUM" },
    dueAt: { type: Date },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

export type Task = InferSchemaType<typeof taskSchema>;

export const TaskModel = mongoose.model("Task", taskSchema);
