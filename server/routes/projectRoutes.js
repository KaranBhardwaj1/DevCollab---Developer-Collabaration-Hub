const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  createProject,
  getMyProjects,
  getProjectById,
  addMember,
  removeMember,
} = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router.post("/", createProject);

router.get("/", getMyProjects);

router.get("/:id", getProjectById);

router.post("/:id/members", addMember);

router.delete("/:id/members", removeMember);

module.exports = router;