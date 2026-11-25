import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function Layout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="sidebar-title">Hotel Admin</h2>
        <nav className="sidebar-nav">
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/room-types">Room Types</NavLink>
          <NavLink to="/bookings">Bookings</NavLink>
          <NavLink to="/hotel-info">Hotel Info</NavLink>
        </nav>
        <div className="sidebar-footer">
          <p>Signed in as {admin?.username}</p>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </aside>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
