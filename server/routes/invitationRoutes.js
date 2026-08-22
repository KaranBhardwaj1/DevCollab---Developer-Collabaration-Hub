const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
} = require("../controllers/invitationController");

const router = express.Router();

router.use(protect);

router.post(
  "/projects/:id",
  sendInvitation
);

router.get(
  "/",
  getMyInvitations
);

router.patch(
  "/:id/accept",
  acceptInvitation
);

router.patch(
  "/:id/reject",
  rejectInvitation
);

module.exports = router;