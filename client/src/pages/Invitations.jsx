import { useEffect, useState } from "react";
import api from "../services/api";

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const response = await api.get("/invitations");

      setInvitations(response.data.invitations);
    } catch (error) {
      console.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.patch(
        `/invitations/${id}/accept`
      );

      fetchInvitations();
    } catch (error) {
      console.error(
        error.response?.data?.message || error.message
      );
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(
        `/invitations/${id}/reject`
      );

      fetchInvitations();
    } catch (error) {
      console.error(
        error.response?.data?.message || error.message
      );
    }
  };

  if (loading) {
    return <p>Loading invitations...</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Invitations
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your project invitations.
        </p>
      </div>

      {invitations.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-500">
            No invitations found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation._id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-semibold">
                {invitation.project?.name}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Invited by{" "}
                {invitation.sender?.name}
              </p>

              <p className="mt-2 text-xs text-slate-400">
                Status: {invitation.status}
              </p>

              {invitation.status === "pending" && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() =>
                      handleAccept(invitation._id)
                    }
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() =>
                      handleReject(invitation._id)
                    }
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invitations;