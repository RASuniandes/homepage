import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { iEEEApi } from "../../utils/APIs/IEEEApi";
import type { IEEEEventResponse } from "../../pages/events/iEEEType";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short" });

export default function IEEETicker() {
  const [events, setEvents] = useState<IEEEEventResponse[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    iEEEApi
      .getEvents({ limit: 5, published: "true" })
      .then((res) => {
        if (cancelled) return;
        const now = Date.now();
        const upcoming = ((res?.data?.events ?? []) as IEEEEventResponse[])
          .filter((e) => new Date(e.attributes["start-time"]).getTime() >= now)
          .sort(
            (a, b) =>
              new Date(a.attributes["start-time"]).getTime() -
              new Date(b.attributes["start-time"]).getTime()
          );
        setEvents(upcoming);
      })
      .catch(() => {
        // Non-critical widget -- fail silently, footer just won't show it.
        if (!cancelled) setEvents([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!events || events.length === 0) return null;

  return (
    <div className="ieee-ticker">
      <span className="ieee-ticker-label">
        <Calendar size={13} /> Próximos eventos IEEE
      </span>
      <div className="ieee-ticker-track">
        {events.map((e) => (
          <a
            key={e.id}
            href={e.attributes.link}
            target="_blank"
            rel="noopener noreferrer"
            className="ieee-ticker-item"
          >
            <span className="ieee-ticker-date">{formatDate(e.attributes["start-time"])}</span>
            <span className="ieee-ticker-title">{e.attributes.title}</span>
          </a>
        ))}
        <Link to="/events" className="ieee-ticker-all">
          Ver todos →
        </Link>
      </div>
    </div>
  );
}
