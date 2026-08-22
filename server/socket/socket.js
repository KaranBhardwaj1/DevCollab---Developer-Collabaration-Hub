const jwt = require("jsonwebtoken");
const Message = require("../models/Message");
const Project = require("../models/Project");

const setupSocket = (io) => {
  // Authenticate Socket.io connection
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `Socket connected: ${socket.user.userId}`
    );

    // Join a project chat room
    socket.on("join_project", async (projectId) => {
      try {
        const project = await Project.findById(projectId);

        if (!project) {
          socket.emit("chat_error", {
            message: "Project not found",
          });
          return;
        }

        const isMember = project.members.some(
          (member) =>
            member.user.toString() ===
            socket.user.userId.toString()
        );

        if (!isMember) {
          socket.emit("chat_error", {
            message: "You are not a member of this project",
          });
          return;
        }

        const room = `project_${projectId}`;

        socket.join(room);

        socket.projectId = projectId;

        socket.emit("joined_project", {
          projectId,
          message: "Joined team chat",
        });

        socket.to(room).emit("user_online", {
          userId: socket.user.userId,
        });

      } catch (error) {
        console.error("Join room error:", error);

        socket.emit("chat_error", {
          message: "Unable to join project chat",
        });
      }
    });

    // Send message
    socket.on(
      "send_message",
      async ({ projectId, content, type = "text" }) => {
        try {
          if (!content?.trim()) {
            return;
          }

          const project = await Project.findById(
            projectId
          );

          if (!project) {
            return;
          }

          const isMember = project.members.some(
            (member) =>
              member.user.toString() ===
              socket.user.userId.toString()
          );

          if (!isMember) {
            socket.emit("chat_error", {
              message:
                "You are not a member of this project",
            });
            return;
          }

          const message = await Message.create({
            project: projectId,
            sender: socket.user.userId,
            content: content.trim(),
            type,
          });

          const populatedMessage =
            await Message.findById(message._id).populate(
              "sender",
              "name email avatar"
            );

          const room = `project_${projectId}`;

          io.to(room).emit(
            "receive_message",
            populatedMessage
          );

        } catch (error) {
          console.error(
            "Send message error:",
            error
          );

          socket.emit("chat_error", {
            message: "Unable to send message",
          });
        }
      }
    );

    // Typing indicator
    socket.on(
      "typing",
      ({ projectId, isTyping }) => {
        const room = `project_${projectId}`;

        socket.to(room).emit("user_typing", {
          userId: socket.user.userId,
          isTyping,
        });
      }
    );

    // ==========================================
// COLLABORATIVE COMPILER
// ==========================================

socket.on(
  "join_compiler",
  async ({ projectId }) => {
    try {
      const project = await Project.findById(projectId);

      if (!project) {
        socket.emit("compiler_error", {
          message: "Project not found",
        });

        return;
      }

      const isMember = project.members.some(
        (member) =>
          member.user.toString() ===
          socket.user.userId.toString()
      );

      if (!isMember) {
        socket.emit("compiler_error", {
          message:
            "You are not a member of this project",
        });

        return;
      }

      const room = `compiler_${projectId}`;

      socket.join(room);

      socket.compilerProjectId = projectId;

      socket.emit("compiler_joined", {
        projectId,
      });

      // Tell everyone in the room that a user joined
      socket.to(room).emit(
        "compiler_user_joined",
        {
          userId: socket.user.userId,
        }
      );

    } catch (error) {
      console.error(
        "Compiler join error:",
        error
      );

      socket.emit("compiler_error", {
        message:
          "Unable to join compiler session",
      });
    }
  }
);

// Code changed
socket.on(
  "compiler_code_change",
  ({ projectId, code }) => {
    const room = `compiler_${projectId}`;

    socket.to(room).emit(
      "compiler_code_change",
      {
        code,
        userId: socket.user.userId,
      }
    );
  }
);

// Programming language changed
socket.on(
  "compiler_language_change",
  ({ projectId, languageId }) => {
    const room = `compiler_${projectId}`;

    socket.to(room).emit(
      "compiler_language_change",
      {
        languageId,
        userId: socket.user.userId,
      }
    );
  }
);

// Cursor/selection updates
socket.on(
  "compiler_cursor_change",
  ({ projectId, position }) => {
    const room = `compiler_${projectId}`;

    socket.to(room).emit(
      "compiler_cursor_change",
      {
        userId: socket.user.userId,
        position,
      }
    );
  }
);

    socket.on("disconnect", () => {
  console.log(
    `Socket disconnected: ${socket.user.userId}`
  );

  if (socket.projectId) {
    const room = `project_${socket.projectId}`;

    socket.to(room).emit("user_offline", {
      userId: socket.user.userId,
    });
  }

  if (socket.compilerProjectId) {
    const room = `compiler_${socket.compilerProjectId}`;

    socket.to(room).emit(
      "compiler_user_left",
      {
        userId: socket.user.userId,
      }
    );
  }
});
  });
};

module.exports = setupSocket;