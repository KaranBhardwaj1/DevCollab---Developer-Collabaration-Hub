const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  askQuestion,
  getQuestions,
  getQuestion,
} = require("../controllers/questionController");

router.get("/", getQuestions);

router.get("/:id", getQuestion);

router.post("/", protect, askQuestion);

module.exports = router;