import { useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DateRangePicker } from "./DateRangePicker";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export type SearchValues = {
  checkIn: string;
  checkOut: string;
  adults: string;
  children: string;
};

type Props = {
  onSearch?: (values: SearchValues) => void;
};

export function SearchForm({ onSearch }: Props) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || todayStr());
  const [checkOut, setCheckOut] = useState(
    params.get("checkOut") ||
      new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [adults, setAdults] = useState(params.get("adults") || "2");
  const [children, setChildren] = useState(params.get("children") || "0");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!checkIn || !checkOut) return;
    const values = { checkIn, checkOut, adults, children };
    if (onSearch) {
      onSearch(values);
    } else {
      const query = new URLSearchParams(values);
      navigate(`/rooms?${query.toString()}`);
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className="field field-dates">
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          minDate={todayStr()}
          onChange={(newCheckIn, newCheckOut) => {
            setCheckIn(newCheckIn);
            setCheckOut(newCheckOut);
          }}
        />
      </div>
      <div className="field">
        <label>Adults</label>
        <input
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(e.target.value)}
        />
      </div>
      <div className="field">
        <label>Children</label>
        <input
          type="number"
          min={0}
          value={children}
          onChange={(e) => setChildren(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary search-button">
        Find your stay <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
