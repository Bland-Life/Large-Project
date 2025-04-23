// src/components/MapExplorer.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
   ComposableMap,
   Geographies,
   Geography,
   Marker
 } from "react-simple-maps";

const GEO_URL =
  "https://unpkg.com/world-atlas@2/countries-110m.json";

type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export default function MapExplorer() {
  const { countryCode, cityId } = useParams<{
    countryCode?: string;
    cityId?: string;
  }>();
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);

  // Fetch cities for a country if one is selected
  useEffect(() => {
    if (countryCode) {
      fetch(`/api/countries/${countryCode}/cities`)
        .then(r => r.json())
        .then((data: City[]) => setCities(data))
        .catch(() => setCities([]));
    } else {
      setCities([]);
    }
  }, [countryCode]);

  return (
    <div style={{ position: "relative" }}>
      {/* BACK BUTTON */}
      <button
        disabled={!countryCode}
        onClick={() => navigate("/map")}
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          zIndex: 1,
        }}
      >
        ← Back
      </button>

      <ComposableMap>
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const iso = geo.properties.ISO_A3;
              const isCurrent = iso === countryCode;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isCurrent ? "#F05" : "#DDD"}
                  stroke="#FFF"
                  style={{
                    default:   { outline: "none" },
                    hover:     { fill: "#AAA", outline: "none", cursor: "pointer" },
                    pressed:   { fill: "#F05", outline: "none" },
                  }}
                  onClick={() => {
                    if (!countryCode) {
                      navigate(`/map/${iso}`);
                    }
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* CITY MARKERS */}
        {countryCode && cities.map(city => (
          <Marker
            key={city.id}
            coordinates={[city.longitude, city.latitude]}
            onClick={() =>
              navigate(`/map/${countryCode}/${city.id}`)
            }
          >
            <circle r={3} fill="#E91E63" />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
