import { useEffect, useState } from "react";
import { api } from "../api";
import type { DashboardStats } from "../types";

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<DashboardStats>("/admin/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard."));
  }, []);

  return (
    <div className="page">
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}
      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <p className="stat-value">{stats.checkInsToday}</p>
            <p className="stat-label">Check-ins Today</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{stats.checkOutsToday}</p>
            <p className="stat-label">Check-outs Today</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{stats.upcomingBookings}</p>
            <p className="stat-label">Upcoming Bookings</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{stats.totalRoomTypes}</p>
            <p className="stat-label">Active Room Types</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">${stats.totalConfirmedRevenue.toFixed(2)}</p>
            <p className="stat-label">Confirmed Revenue</p>
          </div>
        </div>
      )}
    </div>
  );
}
