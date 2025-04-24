import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

interface MapExplorerProps {
  userName?: string;
  onVisitedChange?: (newCount: number) => void;
}

export default function MapExplorer({
  userName,
  onVisitedChange
}: MapExplorerProps) {
  const [visited, setVisited] = useState<Set<string>>(new Set());

  // load saved visits and notify parent of initial count
  useEffect(() => {
    const saved: string[] = JSON.parse(localStorage.getItem("demoVisited") || "[]");
    const set = new Set(saved);
    setVisited(set);
    onVisitedChange && onVisitedChange(set.size);
  }, [onVisitedChange]);

  // toggle a country, persist, and notify parent of new count
  const toggle = (code: string) => {
    setVisited(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      localStorage.setItem("demoVisited", JSON.stringify([...next]));
      onVisitedChange && onVisitedChange(next.size);
      return next;
    });

    // If you have a backend toggle endpoint, you could also:
    // if (userName) {
    //   fetch(`https://ohtheplacesyoullgo.space/api/toggleCountry/${userName}/${code}`, {
    //     method: "POST"
    //   });
    // }
  };

  return (
    <div style={{ width: "100%", border: "2px solid #333", margin: "0 auto" }}>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: "100%", height: "100%", pointerEvents: "auto", userSelect: "none" }}
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
                      fill:    isVisited ? "#ff0066" : "#dddddd",
                      stroke:  "#666",
                      outline: "none"
                    },
                    hover: {
                      fill:    isVisited ? "#ff6699" : "#aaaaaa",
                      stroke:  "#666",
                      outline: "none",
                      cursor: "pointer"
                    },
                    pressed: {
                      fill:    isVisited ? "#ff0066" : "#dddddd",
                      stroke:  "#666",
                      outline: "none"
                    }
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
