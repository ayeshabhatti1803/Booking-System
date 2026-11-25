import { useEffect, useRef, useState } from "react";

type Props = {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  minDate?: string;
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toDateStr(year: number, month: number, day: number) {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

function parseDate(str: string): Date {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(str: string) {
  if (!str) return "";
  const d = parseDate(str);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function DateRangePicker({ checkIn, checkOut, onChange, minDate }: Props) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => parseDate(checkIn || minDate || toDateStr(new Date().getFullYear(), new Date().getMonth(), 1)));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleDayClick(dateStr: string) {
    if (!checkIn || (checkIn && checkOut)) {
      onChange(dateStr, "");
      return;
    }
    if (dateStr <= checkIn) {
      onChange(dateStr, "");
      return;
    }
    onChange(checkIn, dateStr);
    setOpen(false);
  }

  function changeMonth(delta: number) {
    setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (string | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(toDateStr(year, month, day));

  return (
    <div className="date-range-picker" ref={containerRef}>
      <button
        type="button"
        className="date-range-trigger"
        onClick={() => setOpen((o) => !o)}
      >
        <span>
          <span className="date-range-label">Check-in</span>
          <span className="date-range-value">{formatDisplay(checkIn) || "Select date"}</span>
        </span>
        <span className="date-range-arrow" aria-hidden="true">→</span>
        <span>
          <span className="date-range-label">Check-out</span>
          <span className="date-range-value">{formatDisplay(checkOut) || "Select date"}</span>
        </span>
      </button>
      {open && (
        <div className="calendar-popover">
          <div className="calendar-header">
            <button type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">‹</button>
            <span>{MONTH_NAMES[month]} {year}</span>
            <button type="button" onClick={() => changeMonth(1)} aria-label="Next month">›</button>
          </div>
          <div className="calendar-weekdays">
            {WEEKDAY_NAMES.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {cells.map((dateStr, i) => {
              if (!dateStr) return <span key={`empty-${i}`} className="calendar-day calendar-day-empty" />;
              const disabled = Boolean(minDate && dateStr < minDate);
              const isStart = dateStr === checkIn;
              const isEnd = dateStr === checkOut;
              const inRange = Boolean(checkIn && checkOut && dateStr > checkIn && dateStr < checkOut);
              const classes = [
                "calendar-day",
                disabled ? "calendar-day-disabled" : "",
                isStart || isEnd ? "calendar-day-selected" : "",
                inRange ? "calendar-day-in-range" : "",
              ].filter(Boolean).join(" ");
              return (
                <button
                  type="button"
                  key={dateStr}
                  className={classes}
                  disabled={disabled}
                  onClick={() => handleDayClick(dateStr)}
                >
                  {Number(dateStr.slice(-2))}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
