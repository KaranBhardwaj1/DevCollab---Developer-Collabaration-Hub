const Task = require("../models/Task");
const Project = require("../models/Project");

const getMemberProject = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) return { project: null, member: null };
  const member = project.members.find((m) => m.user.toString() === userId.toString());
  return { project, member };
};

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { project, member } = await getMemberProject(projectId, req.user.userId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!member) return res.status(403).json({ message: "You are not a member of this project" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, assignee, dueDate } = req.body;
    const { project, member } = await getMemberProject(projectId, req.user.userId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!member) return res.status(403).json({ message: "You are not a member of this project" });
    if (!title?.trim()) return res.status(400).json({ message: "Task title is required" });

    if (assignee && !project.members.some((m) => m.user.toString() === assignee.toString())) {
      return res.status(400).json({ message: "Assignee must be a project member" });
    }

    const task = await Task.create({
      project: projectId, title: title.trim(), description, priority, assignee: assignee || null,
      dueDate: dueDate || null, createdBy: req.user.userId,
    });
    const populated = await Task.findById(task._id)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email");
    res.status(201).json({ task: populated });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const { project, member } = await getMemberProject(task.project, req.user.userId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!member) return res.status(403).json({ message: "You are not a member of this project" });

    const allowed = ["title", "description", "status", "priority", "assignee", "dueDate"];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) task[key] = req.body[key];
    });
    if (task.assignee && !project.members.some((m) => m.user.toString() === task.assignee.toString())) {
      return res.status(400).json({ message: "Assignee must be a project member" });
    }
    await task.save();
    const populated = await Task.findById(task._id).populate("assignee", "name email avatar").populate("createdBy", "name email");
    res.json({ task: populated });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    const { project, member } = await getMemberProject(task.project, req.user.userId);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (!member) return res.status(403).json({ message: "You are not a member of this project" });
    if (member.role !== "owner") return res.status(403).json({ message: "Only the project owner can delete tasks" });
    await Task.findByIdAndDelete(task._id);
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
