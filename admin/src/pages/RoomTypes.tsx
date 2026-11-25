import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { RoomType } from "../types";

const emptyForm = {
  name: "",
  description: "",
  basePrice: "",
  maxAdults: "2",
  maxChildren: "0",
  bedType: "",
  totalRooms: "1",
  amenities: "",
  images: "",
  active: true,
};

export function RoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  function load() {
    api
      .get<RoomType[]>("/admin/room-types")
      .then((res) => setRoomTypes(res.data))
      .catch(() => setError("Could not load room types."));
  }

  useEffect(load, []);

  function startCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(rt: RoomType) {
    setForm({
      name: rt.name,
      description: rt.description,
      basePrice: String(rt.basePrice),
      maxAdults: String(rt.maxAdults),
      maxChildren: String(rt.maxChildren),
      bedType: rt.bedType,
      totalRooms: String(rt.totalRooms),
      amenities: rt.amenities.join(", "),
      images: rt.images.join(", "),
      active: rt.active,
    });
    setEditingId(rt.id);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      name: form.name,
      description: form.description,
      basePrice: Number(form.basePrice),
      maxAdults: Number(form.maxAdults),
      maxChildren: Number(form.maxChildren),
      bedType: form.bedType,
      totalRooms: Number(form.totalRooms),
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      images: form.images
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      active: form.active,
    };
    try {
      if (editingId) {
        await api.put(`/admin/room-types/${editingId}`, payload);
      } else {
        await api.post("/admin/room-types", payload);
      }
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not save room type.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this room type? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/room-types/${id}`);
      load();
    } catch {
      setError("Could not delete room type.");
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Room Types</h1>
        <button className="btn btn-primary" onClick={startCreate}>
          + Add Room Type
        </button>
      </div>
      {error && <p className="error">{error}</p>}

      {showForm && (
        <form className="panel-form" onSubmit={handleSubmit}>
          <h2>{editingId ? "Edit Room Type" : "New Room Type"}</h2>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
            />
          </div>
          <div className="field-row">
            <div className="field">
              <label>Base Price / night</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={form.basePrice}
                onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Total Rooms</label>
              <input
                type="number"
                min={1}
                value={form.totalRooms}
                onChange={(e) => setForm({ ...form, totalRooms: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="field-row">
            <div className="field">
              <label>Max Adults</label>
              <input
                type="number"
                min={1}
                value={form.maxAdults}
                onChange={(e) => setForm({ ...form, maxAdults: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Max Children</label>
              <input
                type="number"
                min={0}
                value={form.maxChildren}
                onChange={(e) => setForm({ ...form, maxChildren: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Bed Type</label>
              <input value={form.bedType} onChange={(e) => setForm({ ...form, bedType: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Amenities (comma separated)</label>
            <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
          </div>
          <div className="field">
            <label>Image URLs (comma separated)</label>
            <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
          </div>
          <div className="field checkbox-field">
            <label>
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />{" "}
              Active (visible to guests)
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price/night</th>
            <th>Rooms</th>
            <th>Occupancy</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {roomTypes.map((rt) => (
            <tr key={rt.id}>
              <td>{rt.name}</td>
              <td>${rt.basePrice.toFixed(2)}</td>
              <td>{rt.totalRooms}</td>
              <td>
                {rt.maxAdults} adults / {rt.maxChildren} children
              </td>
              <td>{rt.active ? "Yes" : "No"}</td>
              <td className="table-actions">
                <button className="btn btn-secondary" onClick={() => startEdit(rt)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDelete(rt.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
