const Message = require("../models/Message");
const Project = require("../models/Project");

const getProjectMessages = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const isMember = project.members.some(
      (member) =>
        member.user.toString() === req.user.userId.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this project",
      });
    }

    const messages = await Message.find({
      project: id,
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 })
      .limit(200);

    res.status(200).json({
      messages,
    });
  } catch (error) {
    console.error("Get messages error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getProjectMessages,
};