import connectDB from "../DB/connection.js";
import userRouter from "./modules/user/user.router.js";
import authRouter from "./modules/auth/auth.router.js";
import taskRouter from "./modules/task/task.router.js";
import { GlobalerrorHandling } from "./utils/errorHandling.js";

const bootstrap = (app, express) => {
  connectDB();
  app.use(express.json());
  app.use("/auth", authRouter);
  app.use("/user", userRouter);
  app.use("/task", taskRouter);
  app.use(GlobalerrorHandling);
};
export default bootstrap;
