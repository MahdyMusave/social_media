import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import ejs from "ejs";
import dbConnect from "./db/connect.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import path from "path";
import AllRouter from "./router/index.js";
import { fileURLToPath } from "url";
const __dirname = path.resolve(path.dirname(""));

dotenv.config();
const app = express();
const Port = process.env.PORT || 400;
dbConnect();

app.set(express.static(path.join(__dirname, "views/build")));
app.set("view engine", "ejs");
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.use("/", AllRouter);
app.use(errorMiddleware);
// app.get("/", (req, res) => {
//   res.render("build/verification.ejs");
// });

app.listen(Port, () => {
  // console.log(res);
  console.log(`server is running on port ${Port} `);
});
