import { useEffect, useState, type FormEvent } from "react";
import { api } from "../api";
import type { HotelInfo as HotelInfoType } from "../types";

const emptyForm = {
  name: "",
  description: "",
  address: "",
  phone: "",
  email: "",
  checkInTime: "14:00",
  checkOutTime: "11:00",
  amenities: "",
  policies: "",
  images: "",
};

export function HotelInfo() {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get<HotelInfoType>("/hotel")
      .then((res) =>
        setForm({
          name: res.data.name,
          description: res.data.description,
          address: res.data.address,
          phone: res.data.phone,
          email: res.data.email,
          checkInTime: res.data.checkInTime,
          checkOutTime: res.data.checkOutTime,
          amenities: res.data.amenities.join(", "),
          policies: res.data.policies.join("\n"),
          images: res.data.images.join(", "),
        })
      )
      .catch(() => setError("Could not load hotel info."));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await api.put("/admin/hotel", {
        ...form,
        amenities: form.amenities.split(",").map((a) => a.trim()).filter(Boolean),
        policies: form.policies.split("\n").map((a) => a.trim()).filter(Boolean),
        images: form.images.split(",").map((a) => a.trim()).filter(Boolean),
      });
      setMessage("Hotel info saved.");
    } catch (err: any) {
      setError(err.response?.data?.error || "Could not save hotel info.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <h1>Hotel Info</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form className="panel-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Hotel Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="field">
          <label>Address</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
        <div className="field-row">
          <div className="field">
            <label>Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>
        <div className="field-row">
          <div className="field">
            <label>Check-in Time</label>
            <input value={form.checkInTime} onChange={(e) => setForm({ ...form, checkInTime: e.target.value })} />
          </div>
          <div className="field">
            <label>Check-out Time</label>
            <input value={form.checkOutTime} onChange={(e) => setForm({ ...form, checkOutTime: e.target.value })} />
          </div>
        </div>
        <div className="field">
          <label>Amenities (comma separated)</label>
          <input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} />
        </div>
        <div className="field">
          <label>Policies (one per line)</label>
          <textarea
            value={form.policies}
            onChange={(e) => setForm({ ...form, policies: e.target.value })}
            rows={4}
          />
        </div>
        <div className="field">
          <label>Image URLs (comma separated)</label>
          <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
