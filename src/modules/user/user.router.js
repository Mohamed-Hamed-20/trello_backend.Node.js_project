import { Router } from "express";
import * as usercontrooler from "./controller/user.js";
import { auth } from "../../middleware/auth.js";
const router = Router();

router.post("/ChangePassword", auth , usercontrooler.ChangePassword);
router.put("/Update_User",auth,usercontrooler.Update_User);
router.delete("/DeleteUser",auth , usercontrooler.DeleteUser);
router.delete("/soft_delete",auth, usercontrooler.soft_delete);
router.post("/Logout",auth , usercontrooler.Logout);
export default router;