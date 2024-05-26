import express from "express";
const router = express.Router();
import authRouter from "../router/authRouter.js";
import userRouter from "../router/userRouter.js";
import postRouter from "../router/postRouter.js";

router.use("/api/auth", authRouter);
router.use("/api/users", userRouter);
router.use("/api/post", postRouter);

export default router;
