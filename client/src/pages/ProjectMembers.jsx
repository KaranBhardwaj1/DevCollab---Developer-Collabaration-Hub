import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

const ProjectMembers = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try { setProject((await api.get(`/projects/${id}`)).data.project); }
    catch (e) { setError(e.response?.data?.message || "Unable to load project"); }
  };
  useEffect(()=>{load();},[id]);

  const invite = async (e) => {
    e.preventDefault(); setMessage(""); setError("");
    try { await api.post(`/invitations/projects/${id}`, { email }); setEmail(""); setMessage("Invitation sent successfully."); }
    catch(e){setError(e.response?.data?.message || "Unable to send invitation");}
  };

  const remove = async (userId) => {
    if (!window.confirm("Remove this member?")) return;
    try { await api.delete(`/projects/${id}/members`, { data: { userId } }); await load(); }
    catch(e){setError(e.response?.data?.message || "Unable to remove member");}
  };

  if (!project) return <div className="rounded-xl bg-white p-8 text-slate-500">Loading team...</div>;
  return <div className="space-y-6">
    <div><Link to={`/projects/${id}`} className="text-sm text-slate-400">← {project.name}</Link><h1 className="mt-1 text-2xl font-bold">Team Members</h1><p className="text-sm text-slate-500">Invite developers and manage your private project team.</p></div>
    {(message || error) && <div className={`rounded-lg p-3 text-sm ${error ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>{error || message}</div>}
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={invite} className="rounded-xl border bg-white p-5"><h2 className="font-semibold">Invite Developer</h2><p className="mt-1 text-xs text-slate-500">Enter the developer's registered email.</p><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="developer@email.com" className="mt-4 w-full rounded-lg border p-3 text-sm"/><button className="mt-3 w-full rounded-lg bg-slate-900 p-3 text-sm font-semibold text-white">Send Invitation</button></form>
      <div className="rounded-xl border bg-white p-5"><div className="flex justify-between"><h2 className="font-semibold">Members</h2><span className="text-sm text-slate-400">{project.members.length}</span></div><div className="mt-4 divide-y">{project.members.map(m=><div key={m.user._id} className="flex items-center gap-3 py-4"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">{m.user.name?.[0]?.toUpperCase()}</div><div className="min-w-0 flex-1"><p className="font-medium">{m.user.name}</p><p className="text-xs text-slate-500">{m.user.email}</p></div><span className="rounded-full bg-slate-100 px-3 py-1 text-xs capitalize">{m.role}</span>{m.role !== "owner" && <button onClick={()=>remove(m.user._id)} className="text-xs text-red-500">Remove</button>}</div>)}</div></div>
    </div>
  </div>;
};
export default ProjectMembers;
