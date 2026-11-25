import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export function FindBooking() {
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    navigate(`/manage-booking/${code.trim()}/${token.trim()}`);
  }

  return (
    <div className="container section">
      <h1>Manage Your Booking</h1>
      <p>
        Enter your booking reference and the management code from your confirmation email, or
        open the link we sent you directly.
      </p>
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Booking Reference</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="BK-XXXXXX" required />
        </div>
        <div className="field">
          <label>Management Code</label>
          <input value={token} onChange={(e) => setToken(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">
          Find Booking
        </button>
      </form>
    </div>
  );
}
