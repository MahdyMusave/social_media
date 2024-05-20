import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import Verification from "../model/emailVerification.js";

dotenv.config();
const { AUTH_EMAIL, AUTH_PASSWORD, APP_URL } = process.env;
// console.log(AUTH_EMAIL, AUTH_PASSWORD, APP_URL);
const transporter = nodemailer.createTransport({
  port: 465, // true for 465, false for other ports
  host: "smtp.gmail.com",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASSWORD,
  },
  secure: true,
});

export const sendVerificationEmail = async (userData, res) => {
  // return console.log(dataUser);
  const { _id, email, username } = userData;
  const token = _id + uuidv4();
  const link = APP_URL + "users/verify/" + _id + "/" + token;
  console.log(token);
  const mailData = {
    from: process.env.AUTH_EMAIL,
    to: email,
    text: "hello my friend",
    subject: "Email Verification",
    html: `
    <div style='font-family:Arial,sans-serif;font-size:20px;color:#333,background-color"yellow'>
    <h1>please verify your email address</h1>
    
    <hr>
    <h4>hi ${username}</h4>
    <p>this link <b>expires in 1 hour</p>
    <p>this  link <b>expires in 1 hour </p>
    <a href=${link}>email Address</a>
    `,
  };
  try {
    const hashToken = await hashString(token);
    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 360000,
    });
    if (newVerifiedEmail) {
      transporter.sendMail(mailData, (err, info) => {
        if (err) return console.log(err);
        else return console.log(info.response);
      });
      // transporter
      //   .sendMail(mailData)
      //   .then(() => {
      //     res.status(201).json({
      //       success: "PENDING",
      //       message:
      //         "Verification email has  been sent to your email. check your email for further instruction",
      //     });
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     res.status(404).json("something was wrong");
      //   });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({
      message: "something went wrong",
    });
  }
};
