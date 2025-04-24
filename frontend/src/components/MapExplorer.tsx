// MapExplorer.tsx — fixes “undefined” issue

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker
} from "react-simple-maps";

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

type Props = { userName?: string };
type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

/* ---------- helper ---------- */
const VALID_ISO = /^[A-Z]{3}$/;            // exactly 3 capital letters

export default function MapExplorer({ userName }: Props) {
  const { countryCode } = useParams<{ countryCode?: string }>();
  const navigate = useNavigate();
  const username = userName || localStorage.getItem("username") || "guest";

  /* ---- city list ---- */
  const [cities, setCities] = useState<City[]>([]);
  useEffect(() => {
    if (countryCode) {
      fetch(`/api/countries/${countryCode}/cities`)
        .then(r => r.json())
        .then((d: City[]) => setCities(d))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [countryCode]);

  /* ---- visited ---- */
  const [visited, setVisited] = useState<Set<string>>(new Set());
  useEffect(() => {
    fetch(`https://ohtheplacesyoullgo.space/api/getcountries/${username}`)
      .then(r => r.ok ? r.json() : [])
      .then((arr: string[]) => setVisited(new Set(arr)))
      .catch(() => setVisited(new Set()));
  }, [username]);

  /* ---- toggle ---- */
  function toggleCountry(code: string) {
    if (!VALID_ISO.test(code)) return;          // ignore bad codes

    const next = new Set(visited);
    const nowVisited = !next.has(code);
    nowVisited ? next.add(code) : next.delete(code);
    setVisited(next);

    const base = "https://ohtheplacesyoullgo.space/api";
    const endpoint = nowVisited ? "addcountry" : "deletecountry";
    const method   = nowVisited ? "POST"       : "DELETE";

    fetch(`${base}/${endpoint}/${username}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: code })
    }).catch(console.error);
  }

  /* ---- render ---- */
  return (
    <ComposableMap>
      <Geographies geography={GEO_URL}>
        {({ geographies }) =>
          geographies.map(geo => {
            const iso: string | undefined = geo.properties.ISO_A3;
            const hasValidIso = iso && VALID_ISO.test(iso);
            const isVisited   = hasValidIso && visited.has(iso);

            return (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={isVisited ? "#F05" : "#DDD"}
                stroke="#FFF"
                style={{
                  default: { outline: "none" },
                  hover:   { fill: isVisited ? "#ff4f8a" : "#AAA", outline: "none", cursor: hasValidIso ? "pointer" : "default" },
                  pressed: { fill: "#F05", outline: "none" }
                }}
                onClick={() => {
                  if (!hasValidIso) return;        // Antarctica etc.
                  toggleCountry(iso!);
                  if (!countryCode) navigate(`/map/${iso}`);
                }}
              />
            );
          })
        }
      </Geographies>

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
