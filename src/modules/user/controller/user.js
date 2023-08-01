import { compareSync, hashSync } from "bcrypt";
import usermodel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import jwt from "jsonwebtoken";








export const ChangePassword = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { oldpassword, NewPassword, cpassword } = req.body;
  if (NewPassword != cpassword) {
    return next(new Error("new password and cpassword not matched"));
  }
  // console.log(user.password);
  const chkpass = compareSync(oldpassword, user.password);
  if (!chkpass) {
    return next(
      new Error("old password not matched your password", { cause: 200 })
    );
  }
  const hashNEWpassword = hashSync(NewPassword, parseInt(process.env.num_pasHasing));
  console.log( parseInt(process.env.num_pasHasing));
  // console.log(hashNEWpassword);
  const result = await usermodel.updateOne(
    { _id: user._id },
    { password: hashNEWpassword }
  );

  if (!result) {
    return next(new Error("error user not found try again", { cause: 400 }));
  }
  res.status(200).json({ message: "Done", result });
});











export const Update_User = asyncHandler(async (req, res, next) => {
  const { age, firstName, lastName } = req.body;
  const user = req.user;
  // console.log({ age, firstName, lastName, user });
  const result = await usermodel.findByIdAndUpdate(
    { _id: user._id },
    { age, firstName, lastName },
    { new: true }
  );
  if (!result) {
    return next(new Error("in-valid account"), { cause: 500 });
  }
  res.status(202).json({ message: "Done", result });
});












export const DeleteUser = asyncHandler(async (req, res, next) => {
  const user = req.user;
  console.log(user);
  const result = await usermodel.findByIdAndDelete(
    { _id: user._id },
    { new: true }
  );
  if (!result) {
    return next(new Error("in-valid account"), { cause: 500 });
  }
  res.status(202).json({ message: "Done", result });
});









export const soft_delete = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const result = await usermodel.findByIdAndUpdate(
    { _id: user._id },
    { isDeleted: true }
  );
  if (!result) {
    return next(new Error("in-valid account"), { cause: 500 });
  }
  res
    .status(202)
    .json({ message: "Done your accound deleted by soft delete", result });
});


















export const Logout = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const logout = await usermodel.findByIdAndUpdate(
    { _id: user._id },
    { isOnline: false },
    { new: true }
  );
  if (!logout) {
    return next(new Error("in-valid account"), { cause: 500 });
  }
  res.status(202).json({ message: "Done", logout });
});
