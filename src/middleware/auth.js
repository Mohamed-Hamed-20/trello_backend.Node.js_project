import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/errorHandling.js";
import usermodel from "../../DB/models/user.model.js";
import { parse } from "date-fns";
import nodemailer from "nodemailer";


export const auth = asyncHandler(async (req, res, next) => {
  const { authorization } = req.headers;
console.log(authorization);
if (!authorization?.startsWith("Bearer ")) {
  return next(new Error("authorization is reqired or is not bearer token"));
}

const SBtoken = authorization.split("Bearer ")[1]
// console.log(SBtoken);
  const token = jwt.verify(SBtoken, process.env.token_pass);
  if (!token?.id) {
    return next(new Error("in-valid token payload", { cause: 240 }));
  }
  const user = await usermodel.findById({ _id: token.id });
  if (!user) {
    return next(new Error("in-valid account", { cause: 403 }));
  }
  if (user.isDeleted == true) {
    return next(
      new Error(
        "This account IS deleted before by soft delete but u can login and restore your account",
        { cause: 403 }
      )
    );
  }
  
  if (user.isOnline == false) {
    return next(new Error("please login frist", { cause: 302 }));
  }
  req.user = user;
  return next();
});











export const deadlinecon = asyncHandler(async (req, res, next) => {
  const { deadline } = req.body;
  const convertdeadline = parse(deadline, "dd/MM/yyyy", new Date());
  const currentdate = new Date();
  if (convertdeadline < currentdate) {
    return next(new Error("Enter-Valid Date"));
  }
  req.deadline = convertdeadline;
  next();
});














export const chkassignto = asyncHandler(async (req, res, next) => {
  const { assignTo } = req.body;
  const chkassignto = await usermodel.findById({ _id: assignTo });
  if (!chkassignto) {
    return next(
      new Error("this user you want to assign this task not exist :(")
    );
  }
  req.assignTo = chkassignto._id;
  console.log(req.assignTo);
  next();
});



