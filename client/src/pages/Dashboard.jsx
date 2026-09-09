import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    teamMembers: 0,
    reputation: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard/stats");

        setStats(response.data.stats);
        setRecentActivity(response.data.recentActivity || []);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: "📁",
      description: "Your active projects",
      action: () => navigate("/projects"),
    },
    {
      title: "Tasks",
      value: stats.tasks,
      icon: "✅",
      description: `${stats.completedTasks} completed`,
      action: () => navigate("/tasks"),
    },
    {
      title: "Team Members",
      value: stats.teamMembers,
      icon: "👥",
      description: "Across your projects",
      action: () => navigate("/projects"),
    },
    {
      title: "Reputation",
      value: stats.reputation,
      icon: "⭐",
      description: "Developer reputation",
      action: () => navigate("/devconnect"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6">

      {/* HEADER */}
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
              Developer Workspace
            </p>

            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
              Welcome back, {user?.name}! 👋
            </h1>

            <p className="mt-2 text-slate-300">
              Manage your projects, tasks and developer collaboration from one place.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects")}
            className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:from-indigo-400 hover:to-purple-500"
          >
            + Create Project
          </button>

        </div>
      </div>


      {/* STAT CARDS */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {statCards.map((stat) => (
          <button
            key={stat.title}
            onClick={stat.action}
            className="group rounded-2xl border border-white/10 bg-white/[0.08] p-5 text-left shadow-xl backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:bg-white/[0.12]"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 text-2xl">
                {stat.icon}
              </div>

              <span className="text-3xl font-black text-white">
                {loading ? "..." : stat.value}
              </span>

            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              {stat.title}
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              {stat.description}
            </p>

          </button>
        ))}

      </div>


      {/* PROGRESS */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-xl">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Task Progress
            </h2>

            <p className="text-sm text-slate-400">
              Keep track of your development work
            </p>
          </div>

          <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-300">
            {stats.tasks === 0
              ? 0
              : Math.round(
                  (stats.completedTasks / stats.tasks) * 100
                )}
            %
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-700">

          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700"
            style={{
              width:
                stats.tasks === 0
                  ? "0%"
                  : `${Math.round(
                      (stats.completedTasks / stats.tasks) * 100
                    )}%`,
            }}
          />

        </div>

        <div className="mt-3 flex justify-between text-xs text-slate-400">
          <span>
            {stats.completedTasks} completed
          </span>

          <span>
            {stats.pendingTasks} remaining
          </span>
        </div>

      </div>


      {/* WORKSPACE CARDS */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">

        {/* PRIVATE TEAM */}
        <div className="rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-6 shadow-xl">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-2xl">
              🔐
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Private Team Workspace
              </h2>

              <p className="text-sm text-slate-400">
                Collaborate privately with your project team.
              </p>
            </div>

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">

            <button
              onClick={() => navigate("/projects")}
              className="rounded-xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]"
            >
              <span className="text-xl">💬</span>

              <p className="mt-3 font-semibold text-white">
                Team Chat
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Communicate with your team
              </p>
            </button>


            <button
              onClick={() => navigate("/projects")}
              className="rounded-xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]"
            >
              <span className="text-xl">💻</span>

              <p className="mt-3 font-semibold text-white">
                Team Compiler
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Code privately with your team
              </p>
            </button>

          </div>

        </div>


        {/* DEVCONNECT */}
        <div className="rounded-2xl border border-pink-400/20 bg-gradient-to-br from-pink-500/15 to-purple-500/10 p-6 shadow-xl">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500/20 text-2xl">
              🌐
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                DevConnect
              </h2>

              <p className="text-sm text-slate-400">
                Connect, learn and solve problems with developers.
              </p>
            </div>

          </div>


          <div className="mt-6 grid grid-cols-2 gap-4">

            <button
              onClick={() => navigate("/devconnect")}
              className="rounded-xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]"
            >
              <span className="text-xl">❓</span>

              <p className="mt-3 font-semibold text-white">
                Q&A Forum
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Ask and answer questions
              </p>
            </button>


            <button
              onClick={() => navigate("/global-compiler")}
              className="rounded-xl border border-white/10 bg-white/[0.07] p-4 text-left transition hover:bg-white/[0.12]"
            >
              <span className="text-xl">⚡</span>

              <p className="mt-3 font-semibold text-white">
                Global Compiler
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Test your code online
              </p>
            </button>

          </div>

        </div>

      </div>


      {/* RECENT ACTIVITY */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.07] p-6 shadow-xl backdrop-blur-xl">

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-white">
              Recent Activity
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Latest activity in your workspace
            </p>
          </div>

          <span className="text-xl">
            📈
          </span>

        </div>


        {recentActivity.length === 0 ? (

          <div className="mt-5 rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">

            <div className="text-4xl">
              🚀
            </div>

            <p className="mt-3 font-semibold text-white">
              Your workspace is ready!
            </p>

            <p className="mt-1 text-sm text-slate-400">
              Create your first project to start collaborating.
            </p>

            <button
              onClick={() => navigate("/projects")}
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Create Project
            </button>

          </div>

        ) : (

          <div className="mt-5 space-y-3">

            {recentActivity.map((activity, index) => (

              <div
                key={`${activity.type}-${index}`}
                className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.04] p-4"
              >

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20">
                  {activity.type === "project"
                    ? "📁"
                    : "✅"}
                </div>

                <div className="min-w-0 flex-1">

                  <p className="font-semibold text-white">
                    {activity.title}
                  </p>

                  <p className="text-sm text-slate-400">
                    {activity.description}
                  </p>

                </div>

                <span className="text-xs text-slate-500">
                  {new Date(activity.date).toLocaleDateString()}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
};

export default Dashboard;