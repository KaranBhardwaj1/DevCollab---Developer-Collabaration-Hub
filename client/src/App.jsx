import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Invitations from "./pages/Invitations";
import ProjectWorkspace from "./pages/ProjectWorkspace";
import TeamChat from "./pages/TeamChat";
import TeamCompiler from "./pages/TeamCompiler";
import DevConnect from "./pages/DevConnect";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetails from "./pages/QuestionDetails";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />

          {/* We'll create these pages later */}
          <Route
          path="/projects"
          element={<Projects />}
          />

          <Route
            path="/tasks"
            element={
              <div>
                <h1 className="text-2xl font-bold">
                  Tasks
                </h1>
              </div>
            }
          />

          <Route
          path="/projects/:id/chat"
          element={<TeamChat />}
          />

          <Route
          path="/projects/:id/compiler"
          element={<TeamCompiler />}
          />

          <Route
            path="/devconnect"
            element={
              <div>
                <h1 className="text-2xl font-bold">
                  DevConnect
                </h1>
              </div>
            }
          />

          <Route
            path="/questions"
            element={
              <div>
                <h1 className="text-2xl font-bold">
                  Q&A Forum
                </h1>
              </div>
            }
          />

          <Route
            path="/global-compiler"
            element={
              <div>
                <h1 className="text-2xl font-bold">
                  Global Compiler
                </h1>
              </div>
            }
          />

          <Route
            path="/settings"
            element={
              <div>
                <h1 className="text-2xl font-bold">
                  Settings
                </h1>
              </div>
            }
          />
          <Route
          path="/invitations"
          element={<Invitations />}
          />

          <Route
          path="/projects/:id"
          element={<ProjectWorkspace />}
          />

          <Route
          path="/devconnect"
          element={<DevConnect/>}
          />
          
          <Route
          path="/devconnect/ask"
          element={<AskQuestion/>}
          />
          
          <Route
          path="/devconnect/questions/:id"
          element={<QuestionDetails/>}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Login />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;