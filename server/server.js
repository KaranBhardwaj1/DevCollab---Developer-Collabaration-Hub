const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const setupSocket = require("./socket/socket");

dotenv.config();

const app = express();

const server = http.createServer(app);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://dev-collab-developer-collabaration-nine.vercel.app/"
    ],
    methods: ["GET", "POST"],
  },
});

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://dev-collab-developer-collabaration-nine.vercel.app/",
    ],
  })
);

app.use(express.json());

// Connect MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/compiler", compilerRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/answers", answerRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "DevCollab backend is running 🚀",
  });
});

// Socket setup
setupSocket(io);

// Render provides the PORT
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 DevCollab server running on port ${PORT}`);
});
