const Project = require("../models/Project");
const User = require("../models/User");

// =========================
// CREATE PROJECT
// =========================
const createProject = async (req, res) => {
  try {
    const { name, description, deadline, startDate, technologies } =
      req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      owner: req.user.userId,
      deadline: deadline || null,
      startDate: startDate || null,
      technologies: technologies || [],
      members: [
        {
          user: req.user.userId,
          role: "owner",
        },
      ],
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET MY PROJECTS
// =========================
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      "members.user": req.user.userId,
    })
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    console.error("Get projects error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET SINGLE PROJECT
// =========================
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) =>
        member.user._id.toString() === req.user.userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    res.status(200).json({
      project,
    });
  } catch (error) {
    console.error("Get project error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// ADD MEMBER
// =========================
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const currentMember = project.members.find(
      (member) =>
        member.user.toString() === req.user.userId.toString()
    );

    if (
      !currentMember ||
      !["owner", "admin"].includes(currentMember.role)
    ) {
      return res.status(403).json({
        message: "You do not have permission to add members",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyMember = project.members.some(
      (member) => member.user.toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(409).json({
        message: "User is already a project member",
      });
    }

    project.members.push({
      user: userId,
      role: "member",
    });

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email avatar")
      .populate("members.user", "name email avatar");

    res.status(200).json({
      message: "Member added successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Add member error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// REMOVE MEMBER
// =========================
const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const currentMember = project.members.find(
      (member) =>
        member.user.toString() === req.user.userId.toString()
    );

    if (
      !currentMember ||
      !["owner", "admin"].includes(currentMember.role)
    ) {
      return res.status(403).json({
        message: "You do not have permission to remove members",
      });
    }

    if (userId.toString() === project.owner.toString()) {
      return res.status(400).json({
        message: "Project owner cannot be removed",
      });
    }

    project.members = project.members.filter(
      (member) => member.user.toString() !== userId.toString()
    );

    await project.save();

    res.status(200).json({
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Remove member error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  createProject,
  getMyProjects,
  getProjectById,
  addMember,
  removeMember,
};