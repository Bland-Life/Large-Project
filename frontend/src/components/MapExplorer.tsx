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

interface UserData {
  name: string;
  username: string;
  email: string;
  profileimage: string;
}

export default function MapExplorer({
  onStatsChange
}: MapExplorerProps) {
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const didInitial = useRef(false);
  let _ud: any = localStorage.getItem('user_data');
  let ud = JSON.parse(_ud);

  const [userData, setUserData] = useState<UserData | null>(null);
 
   // load saved visits and notify parent of initial count
 
   useEffect(() => {
       // fetch or set user data
       setTimeout(() => {
           if (ud) {
               setUserData({
                   name: ud.firstName,
                   username: ud.username,
                   email: ud.email,
                   profileimage: ud.profileimage,
               });
           }
       }, 1000);
       }, []);
 
   useEffect(() => {
           if (userData) {
               console.log(userData.username);
               const fetchData = async () => {
                   try {
                       const countries = await getCountries(userData.username);
                       console.log(countries);
                       setVisited(new Set(countries));
                   } catch (err) {
                       console.error("Error fetching trips:", err);
                   } finally {
                   }
               };
           
               fetchData();
           }
       }, [userData]);
 
   // toggle a country, persist, and notify parent of new count
   const toggle = async (code: string) => {
     console.log(visited instanceof Set); 
     const next = new Set<string>(visited);
     if (next.has(code)) {
       next.delete(code);
       await removeCountry(userData.username, code);
     }
     else {
       next.add(code);
       await addCountry(userData.username, code);
     }
 
     localStorage.setItem("demoVisited", JSON.stringify([...next]));
     reportStats(next);
     setVisited(next)
     return next;
     // If you have a backend toggle endpoint, you could also:
     // if (userName) {
     //   fetch(`https://ohtheplacesyoullgo.space/api/toggleCountry/${userName}/${code}`, {
     //     method: "POST"
     //   });
     // }
    }

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

  async function getCountries(_username: string) : Promise<string[]> {
    try {
      const response = await fetch(`https://ohtheplacesyoullgo.space/api/getcountries/${_username}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const res = JSON.parse(await response.text());
    return res.countries;
    }
    catch (err) {
      console.error("Error sending data:", err);
      throw err;
  }
  }

  async function addCountry(_username : string, country : string) : Promise<void> {
    try {
      const response = await fetch(`https://ohtheplacesyoullgo.space/api/addcountry/${_username}`, {
        method: "PUT",
        body: JSON.stringify({country}),
        headers: { "Content-Type": "application/json" },
    });

    const res = JSON.parse(await response.text());
    return res;
    }
    catch (err) {
      console.error("Error sending data:", err);
      throw err;
    }
  }

  async function removeCountry(_username : string, country : string) :Promise<void> {
    try {
      const response = await fetch(`https://ohtheplacesyoullgo.space/api/deletecountry/${_username}`, {
        method: "PUT",
        body: JSON.stringify({country}),
        headers: { "Content-Type": "application/json" },
      });

     const res = JSON.parse(await response.text());
     return res;
     }
     catch (err) {
       console.error("Error sending data:", err);
       throw err;
     }
   }

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
