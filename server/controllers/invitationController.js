const Invitation = require("../models/Invitation");
const Project = require("../models/Project");
const User = require("../models/User");

// =========================
// SEND INVITATION
// =========================
const sendInvitation = async (req, res) => {
  try {
    const { userId, email } = req.body;
    const { id: projectId } = req.params;

    if (!userId && !email) {
      return res.status(400).json({ message: "User ID or email is required" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Check sender permission
    const senderMember = project.members.find(
      (member) =>
        member.user.toString() === req.user.userId.toString()
    );

    if (
      !senderMember ||
      !senderMember.role === "owner"
    ) {
      return res.status(403).json({
        message: "You do not have permission to invite members",
      });
    }

    // Check receiver
    const receiver = userId
      ? await User.findById(userId)
      : await User.findOne({ email: email.toLowerCase().trim() });

    const receiverId = receiver?._id;

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check if already a member
    const alreadyMember = project.members.some(
      (member) =>
        member.user.toString() === receiverId.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        message: "User is already a project member",
      });
    }

    // Check pending invitation
    const existingInvitation = await Invitation.findOne({
      project: projectId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(409).json({
        message: "Invitation already sent",
      });
    }

    const invitation = await Invitation.create({
      project: projectId,
      sender: req.user.userId,
      receiver: receiverId,
    });

    const populatedInvitation =
      await Invitation.findById(invitation._id)
        .populate("project", "name")
        .populate("sender", "name email")
        .populate("receiver", "name email");

    res.status(201).json({
      message: "Invitation sent successfully",
      invitation: populatedInvitation,
    });
  } catch (error) {
    console.error("Send invitation error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET MY INVITATIONS
// =========================
const getMyInvitations = async (req, res) => {
  try {
    const invitations = await Invitation.find({
      receiver: req.user.userId,
    })
      .populate("project", "name description")
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      invitations,
    });
  } catch (error) {
    console.error("Get invitations error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// ACCEPT INVITATION
// =========================
const acceptInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(
      req.params.id
    );

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (
      invitation.receiver.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You cannot accept this invitation",
      });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({
        message: "Invitation is no longer pending",
      });
    }

    const project = await Project.findById(
      invitation.project
    );

    if (!project) {
      return res.status(404).json({
        message: "Project no longer exists",
      });
    }

    // Prevent duplicate membership
    const alreadyMember = project.members.some(
      (member) =>
        member.user.toString() ===
        req.user.userId.toString()
    );

    if (!alreadyMember) {
      project.members.push({
        user: req.user.userId,
        role: "member",
      });

      await project.save();
    }

    invitation.status = "accepted";
    await invitation.save();

    res.status(200).json({
      message: "Invitation accepted",
    });
  } catch (error) {
    console.error("Accept invitation error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// REJECT INVITATION
// =========================
const rejectInvitation = async (req, res) => {
  try {
    const invitation = await Invitation.findById(
      req.params.id
    );

    if (!invitation) {
      return res.status(404).json({
        message: "Invitation not found",
      });
    }

    if (
      invitation.receiver.toString() !==
      req.user.userId.toString()
    ) {
      return res.status(403).json({
        message: "You cannot reject this invitation",
      });
    }

    if (invitation.status !== "pending") {
      return res.status(400).json({
        message: "Invitation is no longer pending",
      });
    }

    invitation.status = "rejected";

    await invitation.save();

    res.status(200).json({
      message: "Invitation rejected",
    });
  } catch (error) {
    console.error("Reject invitation error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  sendInvitation,
  getMyInvitations,
  acceptInvitation,
  rejectInvitation,
};