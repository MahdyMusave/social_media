const express = require("express");
const db = require("./db/connect");
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const Port = process.env.PORT || 400;
const app = express();
const userRouter = require("./router/userRouter");
const messageRouter = require("./router/messageRouter");
const postRoute = require("./router/postRouter");
let ejs = require("ejs");
db();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", userRouter);
app.use("/api/post", postRoute);
app.use("/api/message", messageRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(Port, () => {
  // console.log(res);
  console.log(`server is running on port ${Port} `);
});
