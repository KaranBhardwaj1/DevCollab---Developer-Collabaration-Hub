import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects");

      setProjects(response.data.projects);
    } catch (error) {
      console.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return <p>Loading projects...</p>;
  }

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Projects
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your development projects and teams.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">
            You haven't created any projects yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
  key={project._id}
  to={`/projects/${project._id}`}
  className="block rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
>
  <h2 className="text-lg font-semibold text-slate-900">
    {project.name}
  </h2>

  <p className="mt-2 text-sm text-slate-500">
    {project.description || "No description"}
  </p>

  <div className="mt-4 flex items-center justify-between">
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
      {project.status}
    </span>

    <span className="text-sm text-slate-500">
      {project.members.length} member
      {project.members.length !== 1 ? "s" : ""}
    </span>
  </div>
</Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;