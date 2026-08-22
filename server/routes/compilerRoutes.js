const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  runTeamCode,
  getTeamCodeResult,
  getLanguages,
} = require("../controllers/compilerController");

const router = express.Router();

router.use(protect);

router.get(
  "/languages",
  getLanguages
);

router.post(
  "/team/:projectId/run",
  runTeamCode
);

router.get(
  "/team/:projectId/result/:token",
  getTeamCodeResult
);

module.exports = router;