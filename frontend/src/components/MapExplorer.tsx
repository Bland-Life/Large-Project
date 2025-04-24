// src/components/MapExplorer.tsx
import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

interface MapExplorerProps {
  userName?: string; // for future API calls if you like
}

export default function MapExplorer({ userName }: MapExplorerProps) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  // load saved list from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("demoVisited") || "[]");
    setVisited(new Set(saved));
  }, []);

  // toggle any country (geo.id is a string, e.g. "840")
  const toggle = (code: string) => {
    setVisited(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      localStorage.setItem("demoVisited", JSON.stringify([...next]));
      return next;
    });

    // optional: POST to your backend
    // if (userName) {
    //   fetch(
    //     `https://ohtheplacesyoullgo.space/api/toggleCountry/${userName}/${code}`,
    //     { method: "POST" }
    //   );
    // }
  };

  return (
    <div
      // full-width container, height comes from CSS below
      style={{
        width: "100%",
        border: "2px solid #333",
        margin: "0 auto",
      }}
    >
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
          userSelect: "none",
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const code = geo.id as string;
              const isVisited = visited.has(code);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => toggle(code)}
                  style={{
                    default: {
                      fill: isVisited ? "#ff0066" : "#dddddd",
                      stroke: "#666",
                      outline: "none",
                    },
                    hover: {
                      fill: isVisited ? "#ff6699" : "#aaaaaa",
                      stroke: "#666",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: isVisited ? "#ff0066" : "#dddddd",
                      stroke: "#666",
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
}
