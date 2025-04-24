// MapExplorer.tsx — click country to mark/un-mark (localStorage + API)

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const GEO_URL   = "https://unpkg.com/world-atlas@2/countries-110m.json";
const VALID_ISO = /^[A-Z]{3}$/;   // three capital letters, e.g. USA

/* ----------  types  ---------- */
type Props = { userName?: string };
type City  = { id: string; latitude: number; longitude: number };

export default function MapExplorer({ userName }: Props) {
  /* ----------  router / user  ---------- */
  const { countryCode } = useParams<{ countryCode?: string }>();
  const navigate  = useNavigate();
  const username  = userName || localStorage.getItem("username") || "guest";

  /* ----------  city list for a country  ---------- */
  const [cities, setCities] = useState<City[]>([]);
  useEffect(() => {
    if (!countryCode) return setCities([]);
    fetch(`/api/countries/${countryCode}/cities`)
      .then(r => r.json())
      .then((d: City[]) => setCities(d))
      .catch(() => setCities([]));
  }, [countryCode]);

  /* ----------  visited set  ---------- */
  const [visited, setVisited] = useState<Set<string>>(new Set());

  // 1) load from localStorage immediately
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem(`visited_${username}`) || "[]");
    setVisited(new Set(local));
  }, [username]);

  // 2) overlay with server copy (if reachable)
  useEffect(() => {
    fetch(`https://ohtheplacesyoullgo.space/api/getcountries/${username}`)
      .then(r => (r.ok ? r.json() : []))
      .then((arr: string[]) => setVisited(new Set(arr)))
      .catch(() => {}); // silently ignore if offline
  }, [username]);

  /* ----------  save helper  ---------- */
  const syncToServer = (iso: string, nowVisited: boolean) => {
    const base = "https://ohtheplacesyoullgo.space/api";
    const endpoint = nowVisited ? "addcountry" : "deletecountry";
    const method   = nowVisited ? "POST"       : "DELETE";

    fetch(`${base}/${endpoint}/${username}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: iso })
    }).catch(() => {});
  };

  /* ----------  click handler  ---------- */
  const handleClick = (iso: string) => {
    if (!VALID_ISO.test(iso)) return;     // ignore Antarctica etc.

    setVisited(prev => {
      const next = new Set(prev);
      const nowVisited = !next.has(iso);
      nowVisited ? next.add(iso) : next.delete(iso);

      // persist locally
      localStorage.setItem(`visited_${username}`, JSON.stringify([...next]));

      // fire-and-forget to server
      syncToServer(iso, nowVisited);
      return next;                        // important: return *new* Set
    });
  };

  /* --------------------  render  -------------------- */
  return (
    <ComposableMap>
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map(geo => {
            // robust ISO lookup
            const iso =
              geo.properties.ISO_A3 ||
              geo.properties.iso_a3 ||
              (geo.id as string);

            const goodIso   = VALID_ISO.test(iso);
            const isVisited = goodIso && visited.has(iso);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}

                /* 👉 THIS prop is what triggers colour changes */
                fill={isVisited ? "#F05" : "#DDD"}

                style={{
                  default: { outline: "none" },
                  hover:   { fill: isVisited ? "#ff4f8a" : "#AAA", outline: "none", cursor: goodIso ? "pointer" : "default" },
                  pressed: { fill: "#F05", outline: "none" }
                }}
                onClick={() => {
                  if (!goodIso) return;
                  handleClick(iso);
                  if (!countryCode) navigate(`/map/${iso}`); // keep drill-down
                }}
              />
            );
          })
        }
      </Geographies>

      {/* city markers stay unchanged */}
      {countryCode && cities.map(c => (
        <Marker
          key={c.id}
          coordinates={[c.longitude, c.latitude]}
          onClick={() => navigate(`/map/${countryCode}/${c.id}`)}
        >
          <circle r={3} fill="#E91E63" />
        </Marker>
      ))}
    </ComposableMap>
  );
}
