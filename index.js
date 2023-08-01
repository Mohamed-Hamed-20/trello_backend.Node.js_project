import express from "express";
import dotenv from "dotenv";
import bootstrap from "./src/index.router.js";
import sendEmail from "./src/utils/email.js";
dotenv.config();
const app = express();



bootstrap(app, express);
app.listen(process.env.port, () =>
  console.log(`Example app listening on port ${process.env.port}!`)
);
