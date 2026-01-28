import mongoose, { type InferSchemaType } from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: "" },
    objectives: { type: [String], default: [] },
    deadline: { type: Date },
    tags: { type: [String], default: [] },
    createdBy: { type: String, required: true }
  },
  { timestamps: true }
);

export type Project = InferSchemaType<typeof projectSchema>;

export const ProjectModel = mongoose.model("Project", projectSchema);
