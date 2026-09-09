const Project = require("../models/Project");
const Task = require("../models/Task");

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get projects where user is a member
    const projects = await Project.find({
      "members.user": userId,
    })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    // Get tasks from user's projects
    const projectIds = projects.map((project) => project._id);

    const tasks = await Task.find({
      project: { $in: projectIds },
    })
      .populate("project", "name")
      .populate("assignee", "name email")
      .sort({ createdAt: -1 });

    // Count unique team members
    const memberIds = new Set();

    projects.forEach((project) => {
      project.members.forEach((member) => {
        memberIds.add(member.user.toString());
      });
    });

    // Task statistics
    const completedTasks = tasks.filter(
      (task) => task.status === "done"
    ).length;

    const pendingTasks = tasks.filter(
      (task) => task.status !== "done"
    ).length;

    // Recent activity
    const recentProjects = projects.slice(0, 5).map((project) => ({
      type: "project",
      title: project.name,
      description: "Project created",
      date: project.createdAt,
    }));

    const recentTasks = tasks.slice(0, 5).map((task) => ({
      type: "task",
      title: task.title,
      description: `Task in ${task.project?.name || "project"}`,
      date: task.createdAt,
    }));

    const recentActivity = [
      ...recentProjects,
      ...recentTasks,
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6);

    res.status(200).json({
      stats: {
        projects: projects.length,
        tasks: tasks.length,
        teamMembers: memberIds.size,
        reputation: req.user.reputation || 0,
        completedTasks,
        pendingTasks,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      message: "Failed to load dashboard statistics",
    });
  }
};

module.exports = {
  getDashboardStats,
};