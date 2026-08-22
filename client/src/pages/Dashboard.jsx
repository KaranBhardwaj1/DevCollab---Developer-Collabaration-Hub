import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Projects",
      value: "0",
      icon: "📁",
    },
    {
      title: "Tasks",
      value: "0",
      icon: "✅",
    },
    {
      title: "Team Members",
      value: "0",
      icon: "👥",
    },
    {
      title: "Reputation",
      value: user?.reputation || 0,
      icon: "⭐",
    },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-slate-900 p-6">

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
  Welcome back, {user?.name}! 👋
</h1>

       <p className="mt-1 text-slate-300">
  Here’s what’s happening in your developer workspace.
</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-xl border border-slate-200 bg-gray-100 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{stat.icon}</span>

              <span className="text-2xl font-bold text-slate-900">
                {stat.value}
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {stat.title}
            </p>
          </div>
        ))}
      </div>

      {/* Main Sections */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Private Workspace */}
        <div className="rounded-xl border border-slate-200 bg-gray-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔐</span>

            <div>
              <h2 className="font-semibold text-slate-900">
                Private Team Workspace
              </h2>

              <p className="text-sm text-slate-500">
                Work privately with your project team.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium">
                💬 Team Chat
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Team communication
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium">
                💻 Team Compiler
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Private coding sessions
              </p>
            </div>
          </div>
        </div>

        {/* Public Community */}
        <div className="rounded-xl border border-slate-200 bg-gray-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌐</span>

            <div>
              <h2 className="font-semibold text-slate-900">
                DevConnect
              </h2>

              <p className="text-sm text-slate-500">
                Connect with developers worldwide.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium">
                ❓ Q&A Forum
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Ask and answer questions
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-medium">
                💻 Global Compiler
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Practice and test code
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Activity */}
      <div className="rounded-xl border border-slate-200 bg-gray-200 p-6">
        <h2 className="font-semibold text-slate-900">
          Recent Activity
        </h2>

        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
          No recent activity yet. Start by creating your first project.
        </div>
      </div>

    </div>
  );
};

export default Dashboard;