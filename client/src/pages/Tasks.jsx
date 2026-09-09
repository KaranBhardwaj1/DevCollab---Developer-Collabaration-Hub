import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const Tasks = () => {
  const { id: projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", assignee: "", dueDate: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [projectRes, taskRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/project/${projectId}`),
      ]);
      setProject(projectRes.data.project);
      setTasks(taskRes.data.tasks);
    } catch (e) {
      setError(e.response?.data?.message || "Unable to load tasks");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [projectId]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    try {
      setSaving(true); setError("");
      await api.post(`/tasks/project/${projectId}`, { ...form, assignee: form.assignee || null });
      setForm({ title: "", description: "", priority: "medium", assignee: "", dueDate: "" });
      await load();
    } catch (e) { setError(e.response?.data?.message || "Unable to create task"); }
    finally { setSaving(false); }
  };

  const updateStatus = async (task, status) => {
    try { await api.patch(`/tasks/${task._id}`, { status }); await load(); }
    catch (e) { setError(e.response?.data?.message || "Unable to update task"); }
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try { await api.delete(`/tasks/${id}`); await load(); }
    catch (e) { setError(e.response?.data?.message || "Unable to delete task"); }
  };

  if (loading) return <div className="rounded-xl bg-white p-8 text-slate-500">Loading tasks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <Link to={`/projects/${projectId}`} className="text-sm text-slate-400 hover:text-slate-700">← {project?.name || "Project"}</Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Project Tasks</h1>
          <p className="text-sm text-slate-500">Plan, assign and track work for your team.</p>
        </div>
        <span className="rounded-full bg-slate-900 px-4 py-2 text-sm text-white">{tasks.length} task{tasks.length !== 1 ? "s" : ""}</span>
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form onSubmit={createTask} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Create Task</h2>
          <div className="mt-4 space-y-3">
            <input required placeholder="Task title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-500" />
            <textarea placeholder="Description" rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-slate-500" />
            <select value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm">
              <option value="low">Low priority</option><option value="medium">Medium priority</option><option value="high">High priority</option>
            </select>
            <select value={form.assignee} onChange={e=>setForm({...form,assignee:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm">
              <option value="">Unassigned</option>
              {project?.members?.map(m=><option key={m.user._id} value={m.user._id}>{m.user.name}</option>)}
            </select>
            <input type="date" value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})} className="w-full rounded-lg border border-slate-200 p-3 text-sm" />
            <button disabled={saving} className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50">{saving ? "Creating..." : "Create Task"}</button>
          </div>
        </form>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["todo", "To Do"], ["in-progress", "In Progress"], ["done", "Done"]
          ].map(([status,label]) => (
            <div key={status} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{label}</h2><span className="text-xs text-slate-400">{tasks.filter(t=>t.status===status).length}</span></div>
              <div className="space-y-3">
                {tasks.filter(t=>t.status===status).map(task=>(
                  <div key={task._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex justify-between gap-2"><h3 className="font-medium text-slate-900">{task.title}</h3><span className={`text-xs font-semibold ${task.priority === "high" ? "text-red-500" : task.priority === "low" ? "text-green-600" : "text-amber-600"}`}>{task.priority}</span></div>
                    {task.description && <p className="mt-2 text-xs text-slate-500">{task.description}</p>}
                    <p className="mt-3 text-xs text-slate-500">👤 {task.assignee?.name || "Unassigned"}</p>
                    {task.dueDate && <p className="mt-1 text-xs text-slate-400">Due {new Date(task.dueDate).toLocaleDateString()}</p>}
                    <div className="mt-3 flex gap-2">
                      {status !== "todo" && <button onClick={()=>updateStatus(task,"todo")} className="rounded border px-2 py-1 text-xs">To Do</button>}
                      {status !== "in-progress" && <button onClick={()=>updateStatus(task,"in-progress")} className="rounded border px-2 py-1 text-xs">Progress</button>}
                      {status !== "done" && <button onClick={()=>updateStatus(task,"done")} className="rounded bg-slate-900 px-2 py-1 text-xs text-white">Done</button>}
                      <button onClick={()=>deleteTask(task._id)} className="ml-auto rounded border border-red-200 px-2 py-1 text-xs text-red-500">Delete</button>
                    </div>
                  </div>
                ))}
                {tasks.filter(t=>t.status===status).length===0 && <p className="py-8 text-center text-xs text-slate-400">No tasks</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Tasks;
