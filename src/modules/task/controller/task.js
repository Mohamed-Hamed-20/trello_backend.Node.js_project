import { parse } from "date-fns";
import { asyncHandler } from "../../../utils/errorHandling.js";
import usermodel from "../../../../DB/models/user.model.js";
import taskmodel from "../../../../DB/models/task.router.js";

// 1 add task
export const addtask = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const user = req.user;
  const convertdeadline = req.deadline;
  const assignTo = req.assignTo;
  const addtask = await taskmodel.create({
    title: title,
    description,
    deadline: convertdeadline,
    userId: user._id,
    assignTo: assignTo,
  });
  res.json({ message: `Done`, addtask });
});

// 2 - update task
export const updatetask = asyncHandler(async (req, res, next) => {
  const { title, description, status } = req.body;
  const deadline = req.deadline;
  const assignTo = req.assignTo;
  const { task_id } = req.query;
  const user = req.user;

  //chk status
  if (status != "todo" && status != "donig" && status != "done") {
    return next(new Error("status must be todo or doing or done"));
  }
  //chk found task_id
  const chktaskid = await taskmodel.findById({ _id: task_id });
  if (!chktaskid) {
    return next(new Error("task id not found"));
  }
  //chk this user allow to update this task
  const chkallow = await taskmodel.updateOne(
    { _id: task_id, userId: user._id },
    { title, description, assignTo, status, deadline }
  );
  if (!chkallow?.modifiedCount) {
    return next(new Error("you not allow to update this task "));
  }
  res.json({ message: `done`, chkallow });
});

//3 - delete task
export const deletetask = asyncHandler(async (req, res, next) => {
  const { task_id } = req.query;
  const user = req.user;

  console.log({ task_id, userID: user._id });

  // Check if the task with the given task_id exists
  const chktaskid = await taskmodel.findById({ _id: task_id });

  if (!chktaskid) {
    return next(new Error("Task ID not found"));
  }

  // Check if the user is allowed to delete this task
  const chkallow = await taskmodel.deleteOne({
    _id: task_id,
    userId: user._id,
  });
  if (chkallow.deletedCount !== 1) {
    return next(new Error("You are not allowed to delete this task"));
  }

  res.json({ message: `done`, chkallow });
});

//4 - get all taskes in database
export const getalltaskes = asyncHandler(async (req, res, next) => {
  const result = await taskmodel
    .find()
    .populate({ path: "userId", select: "_id  userName email" })
    .populate({ path: "assignTo", select: "_id  userName email " });
  res.json({ message: `Done`, result });
});

//5-  get all tasks of one user in database search by my token , i am  created this taskes
export const tasks_of_oneUser_helogin = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const result = await taskmodel
    .find({ userId: user._id })
    .populate({ path: "userId", select: " userName  email gender" });
  res.json({ message: `Done`, result });
});

// 6  get all tasks of one user in database when i give u his userid
export const tasks_of_oneUser2 = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  console.log({ userId });
  const result = await taskmodel
    .find({ userId: userId })
    .populate({ path: "userId", select: "userName  email phone" })
    .populate({ path: "assignTo", select: "_id  userName email " });

  res.json({ message: `Done`, result });
});

//7 get all tasks i should to do
export const task_assing_to_me = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const result = await taskmodel
    .find({ assignTo: user._id })
    .populate({ path: "assignTo", select: "email gender" });
  res.json({ message: `Done`, result });
});

// 8-get all tasks that not done after deadline
export const task_not_done = asyncHandler(async (req, res, next) => {
  const currentdate = new Date();
  const result = await taskmodel
    .find(
      {
        status: { $ne: "done" },
        deadline: { $lt: currentdate },
      },
      {},
      { select: "title description status userId  assignTo deadline" }
    )
    .populate({ path: "assignTo", select: "email " });
  res.json({ message: `Done`, result });
});
