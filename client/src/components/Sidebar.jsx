import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const mainLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: "🏠",
    },
    {
      name: "Projects",
      path: "/projects",
      icon: "📁",
    },
    {
      name: "Tasks",
      path: "/tasks",
      icon: "✅",
    },
    {
      name: "Team Chat",
      path: "/team-chat",
      icon: "💬",
    },
    {
      name: "Team Compiler",
      path: "/team-compiler",
      icon: "💻",
    },
    {
      name: "Invitations",
      path: "/invitations",
      icon: "📨",
    },
  ];

  const devConnectLinks = [
    {
      name: "DevConnect",
      path: "/devconnect",
      icon: "🌐",
    },
    {
      name: "Q&A Forum",
      path: "/questions",
      icon: "❓",
    },
    {
      name: "Global Compiler",
      path: "/global-compiler",
      icon: "💻",
    },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-sky-50">
      
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-center text-4xl font-black tracking-tight">
  <span className="text-slate-900">Dev</span>
  <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent">
    Collab
  </span>
</h1>
          <p className="text-xs text-slate-500">
            Developer Hub
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">

        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>

        <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-wide text-slate-400">
          DevConnect
        </p>

        <nav className="space-y-1">
          {devConnectLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom */}
      <div className="border-t border-slate-200 p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
              isActive
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`
          }
        >
          <span>⚙️</span>
          <span>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;