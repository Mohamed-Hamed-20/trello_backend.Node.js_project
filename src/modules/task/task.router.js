import { Router } from "express";
import * as usercontrooler from "./controller/task.js";
import { auth , chkassignto, deadlinecon } from "../../middleware/auth.js";
const router = Router();

router.post("/addtask",auth ,  deadlinecon ,chkassignto,  usercontrooler.addtask);
router.put("/updatetask" ,auth , deadlinecon , chkassignto , usercontrooler.updatetask);
router.delete("/deletetask",auth , usercontrooler.deletetask);

router.get("/getalltaskes", usercontrooler.getalltaskes);
router.get("/tasks_of_oneUser_helogin",auth ,  usercontrooler.tasks_of_oneUser_helogin);
router.get("/tasks_of_oneUser2/:userId", usercontrooler.tasks_of_oneUser2);
router.get("/task_assing_to_me", auth ,usercontrooler.task_assing_to_me);
router.get("/task_not_done", usercontrooler.task_not_done);
export default router;
