import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { Booking, RoomType } from "../types";

const emptyForm = {
  roomTypeId: "",
  checkIn: "",
  checkOut: "",
  adults: "1",
  children: "0",
  roomsBooked: "1",
  guestName: "",
  guestEmail: "",
  guestPhone: "",
  specialRequests: "",
};

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    api
      .get<Booking[]>("/admin/bookings", { params: { status: status || undefined, search: search || undefined } })
      .then((res) => setBookings(res.data))
      .catch(() => setError("Could not load bookings."));
  }

  useEffect(load, [status, search]);

  useEffect(() => {
    api.get<RoomType[]>("/admin/room-types").then((res) => setRoomTypes(res.data));
  }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/admin/bookings", {
        ...form,
        adults: Number(form.adults),
        children: Number(form.children),
        roomsBooked: Number(form.roomsBooked),
      });
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not create booking.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCancel(id: string) {
    if (!confirm("Cancel this booking?")) return;
    await api.post(`/admin/bookings/${id}/cancel`);
    load();
  }

  async function handleComplete(id: string) {
    await api.post(`/admin/bookings/${id}/complete`);
    load();
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Bookings</h1>
        <button className="btn btn-primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Close" : "+ New Booking"}
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="filters">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          placeholder="Search by name, email, or code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="panel-form" onSubmit={handleCreate}>
          <h2>New Manual Booking</h2>
          <div className="field">
            <label>Room Type</label>
            <select
              value={form.roomTypeId}
              onChange={(e) => setForm({ ...form, roomTypeId: e.target.value })}
              required
            >
              <option value="">Select a room type</option>
              {roomTypes.map((rt) => (
                <option key={rt.id} value={rt.id}>
                  {rt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Check-in</label>
              <input
                type="date"
                value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Check-out</label>
              <input
                type="date"
                value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Adults</label>
              <input
                type="number"
                min={1}
                value={form.adults}
                onChange={(e) => setForm({ ...form, adults: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Children</label>
              <input
                type="number"
                min={0}
                value={form.children}
                onChange={(e) => setForm({ ...form, children: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Rooms</label>
              <input
                type="number"
                min={1}
                value={form.roomsBooked}
                onChange={(e) => setForm({ ...form, roomsBooked: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Guest Name</label>
            <input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} required />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.guestEmail}
                onChange={(e) => setForm({ ...form, guestEmail: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={form.guestPhone} onChange={(e) => setForm({ ...form, guestPhone: e.target.value })} required />
            </div>
          </div>
          <div className="field">
            <label>Special Requests</label>
            <textarea
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              rows={2}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Create Booking"}
            </button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Guest</th>
            <th>Room</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id}>
              <td>{b.bookingCode}</td>
              <td>
                {b.guestName}
                <br />
                <span className="muted">{b.guestEmail}</span>
              </td>
              <td>{b.roomType.name}</td>
              <td>{new Date(b.checkIn).toLocaleDateString()}</td>
              <td>{new Date(b.checkOut).toLocaleDateString()}</td>
              <td>${b.totalPrice.toFixed(2)}</td>
              <td>{b.status}</td>
              <td className="table-actions">
                {b.status === "CONFIRMED" && (
                  <>
                    <button className="btn btn-secondary" onClick={() => handleComplete(b.id)}>
                      Mark Completed
                    </button>
                    <button className="btn btn-danger" onClick={() => handleCancel(b.id)}>
                      Cancel
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
