import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const ProjectWorkspace = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`);

      setProject(response.data.project);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Unable to load project"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [id]);

  if (loading) {
    return <p>Loading project...</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
        {error}
      </div>
    );
  }

  if (!project) {
    return <p>Project not found.</p>;
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

          <div>
            <div className="mb-2 text-sm text-slate-400">
              Projects / {project.name}
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              {project.name}
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              {project.description ||
                "No project description provided."}
            </p>
          </div>

          <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-600">
            {project.status}
          </span>

        </div>
      </div>

      {/* Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Link
          to={`/projects/${id}/tasks`}
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-2xl">✅</div>

          <h2 className="mt-3 font-semibold">
            Tasks
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage project tasks
          </p>
        </Link>

        <Link
          to={`/projects/${id}/chat`}
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-2xl">💬</div>

          <h2 className="mt-3 font-semibold">
            Team Chat
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Talk privately with your team
          </p>
        </Link>

        <Link
          to={`/projects/${id}/compiler`}
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-2xl">💻</div>

          <h2 className="mt-3 font-semibold">
            Private Compiler
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Code and test with teammates
          </p>
        </Link>

        <Link
          to={`/projects/${id}/members`}
          className="rounded-xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className="text-2xl">👥</div>

          <h2 className="mt-3 font-semibold">
            Team Members
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage project members
          </p>
        </Link>

      </div>

      {/* Project Details */}
      <div className="grid gap-6 lg:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">

          <h2 className="text-lg font-semibold">
            Project Details
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Owner
              </p>

              <p className="mt-1 text-sm font-medium">
                {project.owner?.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Members
              </p>

              <p className="mt-1 text-sm font-medium">
                {project.members.length}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Start Date
              </p>

              <p className="mt-1 text-sm">
                {project.startDate
                  ? new Date(
                      project.startDate
                    ).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Deadline
              </p>

              <p className="mt-1 text-sm">
                {project.deadline
                  ? new Date(
                      project.deadline
                    ).toLocaleDateString()
                  : "Not set"}
              </p>
            </div>

          </div>

          {project.technologies?.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Technologies
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.technologies.map(
                  (technology) => (
                    <span
                      key={technology}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {technology}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

        </div>

        {/* Members */}
        <div className="rounded-xl border border-slate-200 bg-white p-6">

          <h2 className="text-lg font-semibold">
            Team Members
          </h2>

          <div className="mt-4 space-y-3">
            {project.members.map((member) => (
              <div
                key={member.user._id}
                className="flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {member.user.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.user.name}
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    {member.user.email}
                  </p>
                </div>

                <span className="text-xs capitalize text-slate-400">
                  {member.role}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
};

export default ProjectWorkspace;