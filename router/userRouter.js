const router = require("express").Router();
const {
  getAllUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require("../controller/userCtrl");

router.get("/", getAllUser);
router.get("/:id", getUser);

router.post("/", createUser);
router.post("/login", login);
// generateToken;

router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
module.exports = router;
