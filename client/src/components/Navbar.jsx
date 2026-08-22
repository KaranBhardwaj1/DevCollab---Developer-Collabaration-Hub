import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-sky-50 px-6">
      
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          Developer Workspace
        </h2>

        <p className="text-xs text-slate-500">
          Collaborate, code and build together
        </p>
      </div>

      <div className="flex items-center gap-4">

        <button
          className="rounded-lg p-2 text-lg hover:bg-slate-100"
          title="Notifications"
        >
          🔔
        </button>

        <div className="flex items-center gap-3">
          
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user?.name}
            </p>

            <p className="text-xs text-slate-500">
              {user?.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Logout
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;