import express from "express";
const router = express.Router();
import authRouter from "../router/authRouter.js";
import userRouter from "../router/userRouter.js";

router.use("/api/auth", authRouter);
router.use("/api/users", userRouter);

export default router;
