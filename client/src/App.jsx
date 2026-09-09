import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Invitations from "./pages/Invitations";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import ProjectMembers from "./pages/ProjectMembers";
import Tasks from "./pages/Tasks";
import TeamChat from "./pages/TeamChat";
import TeamCompiler from "./pages/TeamCompiler";
import DevConnect from "./pages/DevConnect";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetails from "./pages/QuestionDetails";
import GlobalCompiler from "./pages/GlobalCompiler";
import Settings from "./pages/Settings";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";


// Tasks page message
const TasksRedirect = () => (
  <div className="rounded-xl border bg-white p-8">
    <h1 className="text-xl font-bold">
      Tasks belong to a project
    </h1>

    <p className="mt-2 text-sm text-slate-500">
      Open Projects and select a project to manage its tasks.
    </p>
  </div>
);


// 404 page
const NotFound = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="text-center">
      <h1 className="text-5xl font-black">
        404
      </h1>

      <p className="mt-2 text-slate-500">
        Page not found
      </p>
    </div>
  </div>
);


const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* PROTECTED ROUTES */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Projects */}
          <Route
            path="/projects"
            element={<Projects />}
          />

          <Route
            path="/projects/:id"
            element={<ProjectWorkspace />}
          />

          <Route
            path="/projects/:id/tasks"
            element={<Tasks />}
          />

          <Route
            path="/projects/:id/members"
            element={<ProjectMembers />}
          />

          <Route
            path="/projects/:id/chat"
            element={<TeamChat />}
          />

          <Route
            path="/projects/:id/compiler"
            element={<TeamCompiler />}
          />


          {/* Tasks */}
          <Route
            path="/tasks"
            element={<TasksRedirect />}
          />


          {/* Invitations */}
          <Route
            path="/invitations"
            element={<Invitations />}
          />


          {/* DevConnect */}
          <Route
            path="/devconnect"
            element={<DevConnect />}
          />

          <Route
            path="/devconnect/ask"
            element={<AskQuestion />}
          />

          <Route
            path="/devconnect/questions/:id"
            element={<QuestionDetails />}
          />

          {/* Old/alternative Q&A route */}
          <Route
            path="/questions"
            element={<DevConnect />}
          />


          {/* Global Compiler */}
          <Route
            path="/global-compiler"
            element={<GlobalCompiler />}
          />


          {/* Settings */}
          <Route
            path="/settings"
            element={<Settings />}
          />

        </Route>


        {/* 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
};


export default App;