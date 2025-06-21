import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

const FacDashboard = () => {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        setUser(JSON.parse(userString));
      } catch {}
    }

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/facapplication/stats");
        if (!res.ok) throw new Error("Failed to fetch stats");
        setStats(await res.json());
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleView = (status) => {
    navigate(`/fac/${status}`);
  };


  const data = {
    labels: ["Pending", "Approved / Accepted", "Rejected"],
    datasets: [
      {
        data: [stats.pending, stats.approved, stats.rejected],
        backgroundColor: ["#FDB813", "#2ecc71", "#e74c3c"],
      },
    ],
  };

  const statusBorderClass = (s) => {
    if (s === "approved") return "border-green-500";
    if (s === "pending") return "border-yellow-500";
    return "border-red-500";
  };

  const statusDisplayText = {
    pending: "Pending",
    approved: "Approved / Accepted",
    rejected: "Rejected",
  };

  return (
    <div className="p-6 max-w-6xl mx-auto font-sans">
      <h1 className="text-4xl font-bold mb-4">Faculty Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Welcome, <strong>{user.name || user.svvNetId}</strong>
      </p>

      {loading ? (
        <div>Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {["pending", "approved", "rejected"].map((s) => (
              <div
                key={s}
                className={`bg-white p-5 rounded shadow text-center border-2 ${statusBorderClass(s)}`}
              >
                <h2 className="text-xl font-semibold">
                  {statusDisplayText[s]}
                </h2>
                <p className="text-3xl mt-2">{stats[s]}</p>
                <button
                  className="mt-3 text-sm underline text-blue-600"
                  onClick={() => handleView(s)}
                >
                  View {statusDisplayText[s]} Applications
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Application Status Overview</h2>
            <div className="max-w-xs mx-auto">
              <Doughnut data={data} />
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">Control Panel</h2>
            <button className="bg-blue-600 text-white px-4 py-2 rounded mb-2 hover:bg-blue-700">
              Set Deadline
            </button>
            <button className="ml-3 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Settings
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FacDashboard;
