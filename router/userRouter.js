import Router from "express";
import path from "path";
const router = Router();
import {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  following,
  unFollow,
  verifyEmail,
  requestPasswordReset,
  verifyPassword,
  changePasswordReset,
  sendFriendRequest,
  getFriendRequest,
  acceptFriendRequest,
  suggestedFriends,
} from "../controller/userCtrl.js";
import { userAuth } from "../middleware/authMiddlerware.js";
const __dirname = path.resolve(path.dirname(""));

//get all user
router.get("/", getAllUser);
router.get("/gatingFriendRequest", userAuth, getFriendRequest);
//send to view
router.get("/verified", async (req, res) => {
  // return console.log(req.query);
  res.render("build/verification.ejs", { query: req.query });
});

//--------------verified Password
router.get("/verifiedPassword", async (req, res) => {
  res.render("build/resetPassword.ejs", { query: req.query });
});
//verify Email
router.get("/verify/:userId/:token", verifyEmail);

//verify Password
router.get("/verifyPassword/:userId/:token", verifyPassword);
router.get("/:id", userAuth, getUser);
//change password
router.post("/resetPassword", requestPasswordReset);
router.post("/changePassword", changePasswordReset);
//request for new friend
router.post("/friendRequest", userAuth, sendFriendRequest);
router.post("/acceptFriendRequest", userAuth, acceptFriendRequest);
router.post("/suggestedFriends", userAuth, suggestedFriends);
//update
router.put("/:id", userAuth, updateUser);
router.put("/:id/following", following);
router.put("/:id/unFollow", unFollow);

//delete
router.delete("/:id", deleteUser);

export default router;
