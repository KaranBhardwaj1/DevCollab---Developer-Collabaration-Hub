const express = require("express");
const protect = require("../middleware/authMiddleware");
const { getMe, updateMe, searchUsers } = require("../controllers/userController");
const router = express.Router();
router.use(protect);
router.get("/me", getMe);
router.patch("/me", updateMe);
router.get("/search", searchUsers);
module.exports = router;
