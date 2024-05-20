import express from "express";
const router = express.Router();
import { register, login } from "../controller/authCtrl.js";
//post
router.post("/", register);
router.post("/login", login);

export default router;
