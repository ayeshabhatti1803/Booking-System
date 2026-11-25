import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api";
import type { AvailableRoomType, RoomType } from "../types";
import { SearchForm, type SearchValues } from "../components/SearchForm";

const roomImages: Record<string, string> = {
  "Standard Single Room": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=1200&q=82",
  "Deluxe Double Room": "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=82",
  "Family Suite": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=82",
};
const fallbackImage = "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=82";

export function Rooms() {
  const [params, setParams] = useSearchParams();
  const [rooms, setRooms] = useState<(AvailableRoomType | RoomType)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const checkIn = params.get("checkIn");
  const checkOut = params.get("checkOut");
  const adults = params.get("adults") || "2";
  const children = params.get("children") || "0";
  const hasSearch = Boolean(checkIn && checkOut);

  const runSearch = useCallback(
    (values: { checkIn: string | null; checkOut: string | null; adults: string; children: string }) => {
      setLoading(true);
      setError("");
      const hasValuesSearch = Boolean(values.checkIn && values.checkOut);
      const request = hasValuesSearch
        ? api.get<AvailableRoomType[]>("/availability", {
            params: { checkIn: values.checkIn, checkOut: values.checkOut, adults: values.adults, children: values.children },
          })
        : api.get<RoomType[]>("/room-types");

      request
        .then((res) => setRooms(res.data))
        .catch((err) =>
          setError(err.response?.data?.error || "Could not load room availability.")
        )
        .finally(() => setLoading(false));
    },
    []
  );

  // Refetch whenever the URL params change (initial load, back/forward navigation, links from other pages).
  useEffect(() => {
    runSearch({ checkIn, checkOut, adults, children });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, adults, children]);

  function handleSearch(values: SearchValues) {
    // Always re-run the search, even if the dates are identical to the current URL params,
    // since navigating to an unchanged URL wouldn't otherwise re-trigger the effect above.
    setParams(values);
    runSearch(values);
  }

  return (
    <div className="rooms-page">
      <div className="container section rooms-header">
        <p className="eyebrow">Your room, your rhythm</p>
        <h1>Rooms & suites</h1>
        <p className="section-copy">Spaces with a sense of place, made for deep rest and easy mornings.</p>
      </div>
      <div className="rooms-search"><div className="container"><SearchForm onSearch={handleSearch} /></div></div>
      <div className="container section rooms-content">
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && hasSearch && rooms.length === 0 && !error && (
        <p>No rooms available for the selected dates. Try different dates or fewer guests.</p>
      )}

      <div className="room-grid">
        {rooms.map((room) => {
          const bookable = "availableRooms" in room;
          return (
            <div className="room-card" key={room.id}>
              <div className="room-image" style={{ backgroundImage: `url(${room.images[0] || roomImages[room.name] || fallbackImage})` }}>
                <span className="room-tag">{room.name.includes("Suite") ? "Signature stay" : "Guest favourite"}</span>
              </div>
              <div className="room-card-body">
              <div className="room-card-title"><h3>{room.name.replace(" Room", "")}</h3><span>From ${room.basePrice.toFixed(0)}</span></div>
              <p>{room.description}</p>
              <p className="muted">
                {room.bedType} &middot; Up to {room.maxAdults} adults
                {room.maxChildren ? `, ${room.maxChildren} children` : ""}
              </p>
              <ul className="chip-list">
                {room.amenities.slice(0, 4).map((a) => (
                  <li key={a} className="chip">
                    {a}
                  </li>
                ))}
              </ul>
              {bookable && (
                <p className="muted">
                  {(room as AvailableRoomType).availableRooms} room(s) available &middot; Total: $
                  {(room as AvailableRoomType).totalPrice.toFixed(2)} for{" "}
                  {(room as AvailableRoomType).nights} night(s)
                </p>
              )}
              <Link
                to={`/rooms/${room.id}${
                  hasSearch ? `?checkIn=${checkIn}&checkOut=${checkOut}&adults=${adults}&children=${children}` : ""
                }`}
                className="btn btn-primary"
              >
                {bookable ? "Book Now" : "View Details"}
              </Link>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}
