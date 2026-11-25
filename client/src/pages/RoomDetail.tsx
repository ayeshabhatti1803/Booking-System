import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { api } from "../api";
import type { RoomType } from "../types";

const fallbackImage = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85";

export function RoomDetail() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState<RoomType | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [checkIn, setCheckIn] = useState(params.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || "");
  const [adults, setAdults] = useState(params.get("adults") || "2");
  const [children, setChildren] = useState(params.get("children") || "0");
  const [roomsBooked, setRoomsBooked] = useState("1");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    if (!id) return;
    api
      .get<RoomType>(`/room-types/${id}`)
      .then((res) => setRoom(res.data))
      .catch(() => setError("Room type not found."));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!checkIn || !checkOut) {
      setError("Please select check-in and check-out dates.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/bookings", {
        roomTypeId: id,
        checkIn,
        checkOut,
        adults: Number(adults),
        children: Number(children),
        roomsBooked: Number(roomsBooked),
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      });
      navigate(`/confirmation/${res.data.bookingCode}/${res.data.manageToken}`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not complete booking.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error && !room) return <div className="container section error">{error}</div>;
  if (!room) return <div className="container section">Loading...</div>;

  return (
    <div className="container section detail-page">
      <div className="detail-visual" style={{ backgroundImage: `url(${room.images[0] || fallbackImage})` }} />
      <div className="detail-intro">
      <p className="eyebrow">A room to return to</p>
      <h1>{room.name.replace(" Room", "")}</h1>
      <p className="detail-description">{room.description}</p>
      <p className="muted">
        {room.bedType} &middot; Up to {room.maxAdults} adults, {room.maxChildren} children
      </p>
      <ul className="chip-list">
        {room.amenities.map((a) => (
          <li key={a} className="chip">
            {a}
          </li>
        ))}
      </ul>
      <p className="price">From <strong>${room.basePrice.toFixed(2)}</strong> / night</p>
      </div>

      <div className="booking-panel"><h2>Make it yours</h2>
      {error && <p className="error">{error}</p>}
      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <div className="field">
            <label>Check-in</label>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} required />
          </div>
          <div className="field">
            <label>Check-out</label>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} required />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Adults</label>
            <input type="number" min={1} value={adults} onChange={(e) => setAdults(e.target.value)} />
          </div>
          <div className="field">
            <label>Children</label>
            <input type="number" min={0} value={children} onChange={(e) => setChildren(e.target.value)} />
          </div>
          <div className="field">
            <label>Rooms</label>
            <input
              type="number"
              min={1}
              value={roomsBooked}
              onChange={(e) => setRoomsBooked(e.target.value)}
            />
          </div>
        </div>
        <div className="field">
          <label>Full Name</label>
          <input value={guestName} onChange={(e) => setGuestName(e.target.value)} required />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Phone</label>
            <input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} required />
          </div>
        </div>
        <div className="field">
          <label>Special Requests</label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            rows={3}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Booking..." : "Reserve this room"}
        </button>
      </form>
      </div>
    </div>
  );
}
