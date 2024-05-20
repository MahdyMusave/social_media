import Router from "express";
import path from "path";
const router = Router();
import {
  getAllUser,
  // getUser,
  updateUser,
  deleteUser,
  following,
  unFollow,
  verifyEmail,
} from "../controller/userCtrl.js";
//get all user
router.get("/", getAllUser);
//verify Email
// router.get("/:id", getUser);
const __dirname = path.resolve(path.dirname(""));
router.get("/verified", async (req, res) => {
  // res.sendFile(path.join(__dirname, "./views/build", "index.html"));
  // res.sendFile(path.join(__dirname, "views/build/index.ejs"));
  // return res.render("/index");
  res.render("build/verification.ejs");
});
router.get("/verify/:userId/:token", verifyEmail);
// //get user
//update
router.put("/:id", updateUser);
router.put("/:id/following", following);
router.put("/:id/unFollow", unFollow);

//delete
router.delete("/:id", deleteUser);

export default router;
