const express = require("express");
const {
  sendMesssage,
  AllMessages,
} = require("../controllers/messageControllers");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

router.route("/").post(protect, sendMesssage);
router.route("/:chatId").get(protect, AllMessages);

module.exports = router;
