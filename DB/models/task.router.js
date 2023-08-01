import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: "todo",
      lowercase: true,
      enum: ["done", "doing", "todo"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    assignTo: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    deadline: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const taskModel = model("task", taskSchema);
export default taskModel;
