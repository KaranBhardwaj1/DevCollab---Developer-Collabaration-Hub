const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  addAnswer,
  getAnswers,
} = require("../controllers/answerController");

router.get("/:id", getAnswers);

router.post("/:id", protect, addAnswer);

module.exports = router;