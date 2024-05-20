import router from "express";
router.Router();

const {
  getAllMessage,
  getMessage,
  createMessage,
  putMessage,
  deleteMessage,
} = require("../controller/messageCtrl");

router.get("/", getAllMessage);
router.get("/:id", getMessage);

router.post("/", createMessage);

router.put("/:id", putMessage);
router.delete("/:id", deleteMessage);

export default router;
