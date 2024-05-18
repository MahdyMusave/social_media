const router = require("express").Router();
const {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
  following,
  unFollow,
} = require("../controller/userCtrl");
//get
router.get("/", getAllUser);
router.get("/:id", getUser);
//post
router.post("/", createUser);
router.post("/login", login);

//update
router.put("/:id", updateUser);
router.put("/:id/following", following);
router.put("/:id/unFollow", unFollow);

//delete
router.delete("/:id", deleteUser);

module.exports = router;
