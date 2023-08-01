import jwt from "jsonwebtoken";
import usermodel from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { hashSync, compareSync, compare } from "bcrypt";
import sendEmail from "../../../utils/email.js";

export const SignUp = asyncHandler(async (req, res, next) => {
  const { userName, email, password, cpassword, phone, gender } = req.body;
  console.log({ userName, email, password, cpassword, phone, gender });
  if (password != cpassword) {
    return next(new Error("password mis match cpassword"));
  }
  if (gender != "male" && gender != "female") {
    return next(new Error("gender should be male or female"));
  }
  const chkemail = await usermodel.findOne({ email });
  if (chkemail) {
    return next(new Error("email already exist "));
  }
  const chkuserName = await usermodel.findOne({ userName });
  if (chkuserName) {
    return next(new Error("UserName already exist"));
  }
  const hashpassword = hashSync(password, parseInt(process.env.num_pasHasing));
  const result = await usermodel.create({
    userName,
    email,
    password: hashpassword,
    phone,
    gender,
  });
  if (!result) {
    return next(new Error("ERROR try again", { cause: 404 }));
  }

  if (result.confirmEmail) {
    res.redirect("../../../../padges/login.html");
  }
  const confirm_token = jwt.sign(
    { email: email, _id: result._id },
    process.env.token_pass,
    { expiresIn: 60 * 5 }
  );

  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${confirm_token}`;
  const html = `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
</html>`;

  await sendEmail({ to: email, subject: "confirm email", html: html });
  res.status(200).json({ message: "Done", result });
});

export const Login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await usermodel.findOne({ email: email });
  if (!user) {
    return next(new Error("In-Valid Email or Password", { cause: 404 }));
  }
  const chkpass = compareSync(password, user.password);
  if (!chkpass) {
    return next(new Error("In-Valid Email or Password", { cause: 404 }));
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.token_pass,
    { expiresIn: 60 * 60 * 24 * 4 }
  );
  const updateuser = await usermodel.findByIdAndUpdate(
    { _id: user._id },
    { isOnline: true, isDeleted: false }
  );
  res.status(200).json({ message: "Done", token });
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { confirm_token } = req.params;
  const token = jwt.verify(confirm_token, process.env.token_pass);
  console.log(token);
  const user = await usermodel.findByIdAndUpdate(
    { _id: token._id },
    { confirmEmail: true }
  );
  if (!user) {
    res.send(
      `<a href="https://www.youtube.com/" target="_blank" >you look like don't have account singup again </a>`
    );
  }
  if (user.confirmEmail) {
    res.redirect(`https://mo2022hamoo.github.io/login_html_css/`);
  }
});

export const forget_password = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  const findemail = await usermodel.findOne({ email: email });
  if (!findemail) {
    return next(new Error("invalid ypur Email :( "));
  }
  const token = jwt.sign(
    { email: findemail.email, _id: findemail._id },
    process.env.token_pass,
    { expiresIn: 60 * 30 }
  );
  const html = `<a style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B;"href="${req.protocol}://${req.headers.host}/auth/restMYpassword/${token}" target="_blank"">Rest your password </a>`;
  await sendEmail({ to: email, subject: "forget password ", html:html});
  res.json({ message: "check your inbox now " });
});

export const restMYpassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  console.log(token);
  const decode = jwt.verify(token, process.env.token_pass);
  console.log(decode);
  if (!decode?._id && decode?.email) {
    return next(new Error("invalid token payload"));
  }
  const rest_pass = decode._id + "123";
  console.log(rest_pass);
  const hashpassword = hashSync(rest_pass, parseInt(process.env.num_pasHasing));
  const updatepassword = await usermodel.findByIdAndUpdate(
    { _id: decode._id },
    { password: hashpassword },
    { new: true }
  );
  if (!updatepassword) {
    return next(new Error("user not found  or error :("));
  }
  res.send(
    `<p>your password reset now to <h2 style="color: blue; font-size: larger; font-weight: bolder;" >${rest_pass}
    </h2> you can <a style="color: red; font-size: larger; font-weight: bolder;" 
    href="https://mazipan.github.io/login-page-css/12-evernote/index.html">login</a> 
    and change your password to what password you want </p>`
  );
});
