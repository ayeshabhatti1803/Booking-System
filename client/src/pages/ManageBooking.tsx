import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import type { Booking } from "../types";

export function ManageBooking() {
  const { code, token } = useParams();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [message, setMessage] = useState("");

  function load() {
    api
      .get<Booking>(`/bookings/${code}/${token}`)
      .then((res) => setBooking(res.data))
      .catch(() => setError("Booking not found. Check your reference and code."));
  }

  useEffect(load, [code, token]);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    setCancelling(true);
    setError("");
    try {
      await api.post(`/bookings/${code}/${token}/cancel`);
      setMessage("Your booking has been cancelled.");
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not cancel booking.");
    } finally {
      setCancelling(false);
    }
  }

  if (error && !booking) return <div className="container section error">{error}</div>;
  if (!booking) return <div className="container section">Loading...</div>;

  return (
    <div className="container section">
      <h1>Booking {booking.bookingCode}</h1>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p>
        Status: <strong>{booking.status}</strong>
      </p>
      <p>Room: {booking.roomType.name}</p>
      <p>
        Check-in: {new Date(booking.checkIn).toDateString()} &middot; Check-out:{" "}
        {new Date(booking.checkOut).toDateString()}
      </p>
      <p>
        Guests: {booking.adults} adults, {booking.children} children &middot; Rooms:{" "}
        {booking.roomsBooked}
      </p>
      <p>Guest: {booking.guestName} ({booking.guestEmail}, {booking.guestPhone})</p>
      {booking.specialRequests && <p>Special requests: {booking.specialRequests}</p>}
      <p className="price">Total: ${booking.totalPrice.toFixed(2)}</p>

      {booking.status === "CONFIRMED" && (
        <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
          {cancelling ? "Cancelling..." : "Cancel Booking"}
        </button>
      )}
    </div>
  );
}
