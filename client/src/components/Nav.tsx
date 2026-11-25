import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function Nav() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = location.pathname === "/";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header ${isHome ? "site-header-home" : "site-header-solid"}`}>
      <div className="container nav-row">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-mark">G</span>
          <span className="brand-name">Grandview</span>
          <span className="brand-divider" aria-hidden="true" />
          <span className="brand-subtitle">Hotel & Spa</span>
        </Link>
        <nav className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <NavLink to="/" end onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/rooms" onClick={closeMenu}>Rooms</NavLink>
          <NavLink to="/find-booking" onClick={closeMenu}>Manage Booking</NavLink>
        </nav>
        <Link to="/rooms" className="nav-cta" onClick={closeMenu}>Reserve a stay</Link>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
