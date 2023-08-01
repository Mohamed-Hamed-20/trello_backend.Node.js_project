import { Schema, model } from "mongoose";

const usershema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userName: {
      type: String,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      default: "male",
      lowercase: true,
      enum: ["male", "female"],
    },
    phone: {
      type: String,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    confirmEmail:{
      type:Boolean,
      default:false,
    }
  },
  {
    timestamps: true,
  }
);

const usermodel = model("user", usershema);
export default usermodel;
