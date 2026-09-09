DevCollab – Developer Collaboration Hub

DevCollab is a full-stack web platform designed to bring **developer collaboration, project management, real-time communication, coding, and developer Q&A** into one place.

Instead of using different platforms for chatting, managing projects, asking programming questions, and testing code, developers can perform these activities through a single platform.


## Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes

### 📁 Project Management
- Create and manage projects
- Invite developers to projects
- Manage project members
- Project workspace

### ✅ Task Management
- Create and assign tasks
- Track task status
- Manage project activities

### 💬 Team Chat
- Real-time communication between project members
- Team discussions
- Share coding-related questions and solutions
- Powered by Socket.io

### 💻 Team Compiler
- Compiler available inside the private team/project environment
- Write and execute code
- Share coding problems with teammates
- Discuss compiler output directly in the team environment

### 🌐 DevConnect
A global developer community where developers can:
- Ask programming questions
- Answer other developers
- Search questions
- Use programming tags
- Discuss solutions
- Share code

### 🧑‍💻 Public Compiler
- Test code while solving DevConnect questions
- Verify programming solutions
- View execution results

### 🔔 Invitations & Notifications
- Send project invitations
- Receive collaboration updates
- Notify users about relevant activities

---

## 🏗️ System Architecture

                         ┌─────────────────────────────┐
                         │       DEVELOPER / USER      │
                         │                             │
                         │  Login / Register           │
                         │  Projects & Tasks           │
                         │  Team Chat                  │
                         │  DevConnect Q&A             │
                         │  Team / Global Compiler     │
                         └──────────────┬──────────────┘
                                        │
                                        │ HTTPS / REST API
                                        ▼
              ┌──────────────────────────────────────────────┐
              │              FRONTEND LAYER                  │
              │                                              │
              │              React + Vite                    │
              │              Tailwind CSS                    │
              │              React Router                    │
              │              Axios                           │
              │                                              │
              │  Dashboard | Projects | Tasks | Chat         │
              │  DevConnect | Compiler | Settings            │
              └──────────────────────┬───────────────────────┘
                                     │
                                     │ HTTP Requests
                                     ▼
              ┌──────────────────────────────────────────────┐
              │               BACKEND LAYER                  │
              │                                              │
              │              Node.js + Express               │
              │                                              │
              │  ┌────────────┐    ┌──────────────────────┐  │
              │  │ Middleware │───▶│ Authentication       │ │
              │  │ JWT        │    │ & Authorization       │ │
              │  └────────────┘    └──────────────────────┘  │
              │                                              │
              │              API ROUTES / CONTROLLERS        │
              │                         │                    │
              │       ┌─────────────────┼────────────────┐   │
              │       ▼                 ▼                ▼   │
              │  Project & Task    DevConnect        Compiler│
              │     Service        Q&A Service         Service│
              │       │                 │                │   │
              │       └─────────────────┼────────────────┘   │
              │                         │                    │
              └─────────────────────────┼────────────────────┘
                                        │
                    ┌───────────────────┴──────────────────┐
                    │                                      │
                    ▼                                      ▼
       ┌────────────────────────┐              ┌──────────────────────┐
       │      MongoDB Atlas     │              │      Judge0 API      │
       │                        │              │                      │
       │  Users                 │              │  Code Submission     │
       │  Projects              │              │  Compilation         │
       │  Tasks                 │              │  Execution           │
       │  Messages              │              │  Output              │
       │  Questions             │              └──────────────────────┘
       │  Answers               │
       │  Invitations           │
       └────────────────────────┘


                  ┌──────────────────────────────┐
                  │          SOCKET.IO           │
                  │                              │
                  │     Real-Time Communication  │
                  │                              │
                  │     Team Chat                │
                  │     Instant Messages         │
                  │     Live Updates             │
                  └──────────────▲───────────────┘
                                 │
                                 │ WebSocket
                                 │
                         ┌───────┴────────┐
                         │ React Frontend │
                         └────────────────┘
