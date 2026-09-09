import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const NotFound = () => <div className="flex min-h-[60vh] items-center justify-center"><div className="text-center"><h1 className="text-5xl font-black">404</h1><p className="mt-2 text-slate-500">Page not found</p></div></div>;

const App = () => <BrowserRouter><Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectWorkspace />} />
    <Route path="/projects/:id/tasks" element={<Tasks />} />
    <Route path="/projects/:id/members" element={<ProjectMembers />} />
    <Route path="/projects/:id/chat" element={<TeamChat />} />
    <Route path="/projects/:id/compiler" element={<TeamCompiler />} />
    <Route path="/tasks" element={<TasksRedirect />} />
    <Route path="/invitations" element={<Invitations />} />
    <Route path="/devconnect" element={<DevConnect />} />
    <Route path="/devconnect/ask" element={<AskQuestion />} />
    <Route path="/devconnect/questions/:id" element={<QuestionDetails />} />
    <Route path="/questions" element={<DevConnect />} />
    <Route path="/global-compiler" element={<GlobalCompiler />} />
    <Route path="/settings" element={<Settings />} />
  </Route>
  <Route path="*" element={<NotFound />} />
</Routes></BrowserRouter>;

const TasksRedirect = () => <div className="rounded-xl border bg-white p-8"><h1 className="text-xl font-bold">Tasks belong to a project</h1><p className="mt-2 text-sm text-slate-500">Open Projects and select a project to manage its tasks.</p></div>;

export default App;
