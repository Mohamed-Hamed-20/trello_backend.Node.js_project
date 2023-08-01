import { Router } from "express";
import * as usercontrooler from "./controller/auth.js";
const router = Router();

router.post("/SignUp", usercontrooler.SignUp);
router.post("/Login", usercontrooler.Login);
router.get("/confirmEmail/:confirm_token", usercontrooler.confirmEmail);
router.post("/forget_password", usercontrooler.forget_password);
router.get("/restMYpassword/:token", usercontrooler.restMYpassword);
export default router;
