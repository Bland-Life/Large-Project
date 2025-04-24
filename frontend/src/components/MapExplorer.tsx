import React, { useState, useEffect, useRef } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const GEO_URL = "https://unpkg.com/world-atlas@2/countries-110m.json";

// global lookup; filled-in on every render pass
const continentMap: Record<string, string> = {};

interface MapExplorerProps {
  userName?: string;
  // now delivers both country + continent stats
  onStatsChange?: (stats: {
    countryCount: number;
    continentCount: number;
    continents: string[];
  }) => void;
}

export default function MapExplorer({
  onStatsChange
}: MapExplorerProps) {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const didInitial = useRef(false);

  // report stats whenever visited changes
  const reportStats = (set: Set<string>) => {
    const countryCount = set.size;
    const continents = Array.from(set)
      .map(code => continentMap[code])
      .filter(Boolean);
    const uniqueContinents = Array.from(new Set(continents));
    onStatsChange &&
      onStatsChange({
        countryCount,
        continentCount: uniqueContinents.length,
        continents: uniqueContinents
      });
  };

  // on first mount: load from localStorage, report
  useEffect(() => {
    const saved: string[] = JSON.parse(
      localStorage.getItem("demoVisited") || "[]"
    );
    const initialSet = new Set(saved);
    setVisited(initialSet);
    reportStats(initialSet);
    didInitial.current = true;
  }, []);

  // toggle handler
  const toggle = (code: string) => {
    setVisited(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      localStorage.setItem("demoVisited", JSON.stringify([...next]));
      reportStats(next);
      return next;
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
          userSelect: "none"
        }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const code = geo.id as string;
              // grab continent from GeoJSON props
              const cont = (geo.properties as any).CONTINENT || "Unknown";
              continentMap[code] = cont;

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
                      outline: "none"
                    },
                    hover: {
                      fill: isVisited ? "#ff6699" : "#aaaaaa",
                      stroke: "#666",
                      outline: "none",
                      cursor: "pointer"
                    },
                    pressed: {
                      fill: isVisited ? "#ff0066" : "#dddddd",
                      stroke: "#666",
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
