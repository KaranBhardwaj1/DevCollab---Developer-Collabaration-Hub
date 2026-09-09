const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const setupSocket = require("./socket/socket");

dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-collab-developer-collabaration-nine.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

// --------------------
// Database
// --------------------

connectDB();

// --------------------
// API Routes
// --------------------

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --------------------
// Test Route
// --------------------

app.get("/", (req, res) => {
  res.json({
    message: "DevCollab backend is running on Vercel 🚀",
  });
});

// --------------------
// Socket.IO
// --------------------

const io = new Server({
  cors: {
    origin: [
      "http://localhost:5173",
      "https://dev-collab-developer-collabaration-nine.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocket(io);

// --------------------
// Export for Vercel
// --------------------

module.exports = app;