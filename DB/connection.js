import mongoose from "mongoose";

const connectDB = () => {
  mongoose.connect(process.env.connection_link)
    .then((result) => {
      console.log({ message: "conect to DB " });
    })
    .catch((error) => {
      console.log({ message: "error to connect with DB ", error });
    });
};
export default connectDB;
