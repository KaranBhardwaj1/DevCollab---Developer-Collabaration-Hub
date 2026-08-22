const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getProjectMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.use(protect);

router.get(
  "/projects/:id",
  getProjectMessages
);

module.exports = router;