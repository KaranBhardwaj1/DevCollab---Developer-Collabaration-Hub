const User = require("../models/User");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateMe = async (req, res) => {
  try {
    const { name, bio, skills, avatar } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills.filter(Boolean).map(String) : [];
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json({ message: "Profile updated", user: await User.findById(user._id).select("-password") });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ users: [] });
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&"), "i");
    const users = await User.find({ _id: { $ne: req.user.userId }, $or: [{ name: regex }, { email: regex }] })
      .select("name email avatar reputation")
      .limit(10);
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getMe, updateMe, searchUsers };
