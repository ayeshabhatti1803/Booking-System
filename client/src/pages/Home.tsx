import { useEffect, useState } from "react";
import { api } from "../api";
import type { HotelInfo } from "../types";
import { SearchForm } from "../components/SearchForm";

const heroImage =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=85";
const featureImages = [
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80",
];

export function Home() {
  const [hotel, setHotel] = useState<HotelInfo | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<HotelInfo>("/hotel")
      .then((res) => setHotel(res.data))
      .catch(() => setError("Could not load hotel information."));
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="hero-overlay" />
        <div className="container">
          <p className="eyebrow">A considered stay in the heart of the city</p>
          <h1>{hotel?.name || "Grandview Hotel"}</h1>
          <p className="hero-lede">
            {hotel?.description || "Thoughtful rooms, warm service, and a slower kind of luxury."}
          </p>
          <div className="hero-meta"><span>Est. 1987</span><span>★ ★ ★ ★ ★</span><span>Metropolis</span></div>
          <SearchForm />
        </div>
      </section>

      <section className="container section intro-section">
        {error && <p className="error">{error}</p>}
        {hotel && (
          <>
            <div className="section-heading">
              <p className="eyebrow">The Grandview experience</p>
              <h2>Luxury that feels<br /><em>like coming home.</em></h2>
              <p className="section-copy">Every detail is designed for the pause between where you have been and where you are going.</p>
            </div>
            <div className="feature-grid">
              {featureImages.map((image, index) => (
                <div className={`feature-image feature-image-${index + 1}`} key={image} style={{ backgroundImage: `url(${image})` }} />
              ))}
            </div>
            <div className="experience-row">
              <div><strong>24/7</strong><span>Warm, attentive service</span></div>
              <div><strong>{hotel.checkInTime}</strong><span>Check-in begins</span></div>
              <div><strong>{hotel.amenities.length}+</strong><span>Thoughtful amenities</span></div>
            </div>
          </>
        )}
      </section>

      <section className="amenities-band">
        <div className="container amenities-content">
          <div><p className="eyebrow">At your service</p><h2>Stay a little longer.</h2></div>
          <p>{hotel?.amenities.join("  •  ")}</p>
        </div>
      </section>
    </div>
  );
}
