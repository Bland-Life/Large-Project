import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup
} from "react-simple-maps";
import { Feature } from "geojson";

type GeoFeature = Feature & { rsmKey: string };

const geoUrl =
"https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

const MapUI = () => {
  useEffect(() => {
      getCountries();
  }, [])

  let [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  let recentlySelectedCountry = "";
  let _ud : any = localStorage.getItem('user_data');
  let ud = JSON.parse( _ud );
  let loggedInUserId = ud.id;
  let searchForId = 1; // create search box and do localStorage.getItem()
  console.log(loggedInUserId);

  const toggleCountry = (countryName: string) => {
      setSelectedCountries(prev => {
      const updated = new Set(prev);
      if (updated.has(countryName)) {
          updated.delete(countryName); // Deselect
      } else {
          updated.add(countryName); // Select
      }
      return updated;
      });
  };

  async function getCountries() : Promise<void> {
      let obj = {userId:searchForId};
      let js = JSON.stringify(obj);

      try
  {
      const response = await
      fetch('https://ohtheplacesyoullgo.space/api/getcountries',
          {method:'POST',body:js,headers:{'Content-Type':
          'application/json'}});
      
      let txt = await response.text();
      let res = JSON.parse(txt);
      
      setSelectedCountries(new Set(res.countries));

      setLoading(false);
  }
  catch(error:any)
  {
  }
  }

  async function addCountry() : Promise<void> {
      let obj = {userId:loggedInUserId, country:recentlySelectedCountry};
      let js = JSON.stringify(obj);

      try
  {
      const response = await fetch('https://ohtheplacesyoullgo.space/api/addcountry',
          {method:'POST',body:js,headers:{'Content-Type':
          'application/json'}});
  }
  catch(error:any)
  {
  }
  }

  async function deleteCountry() : Promise<void> {
    let obj = {userId:loggedInUserId, country:recentlySelectedCountry};
    let js = JSON.stringify(obj);

    try
    {
      const response = await fetch('https://ohtheplacesyoullgo.space/api/deletecountry',
          {method:'POST',body:js,headers:{'Content-Type':
          'application/json'}});
    }
    catch(error:any)
    {
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
      <div
    style={{
      width: "500px", // Set the width you want
      height: "375px", // Set the height you want
      border: "5px solid black", // Set the border style
      borderRadius: "10px", // Optional: adds rounded corners
      overflow: "hidden" // Prevents overflow if content is too big
    }}
  >
    <ComposableMap projectionConfig={{ scale: 160 }}>
      <ZoomableGroup
      zoom={1}
      minZoom={1}
      maxZoom={8}
      center={[0, 0]} // Start at center of the world
      >
      <Geographies geography={geoUrl}>
        {({ geographies }: { geographies: GeoFeature[] }) =>
          geographies.map((geo: GeoFeature) => {
            const countryName = geo.properties?.name;
            const isSelected = countryName ? selectedCountries.has(countryName) : false;

            return (
              <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    if (searchForId === loggedInUserId) {
                      toggleCountry(countryName);
                      recentlySelectedCountry = countryName;
                      if (!selectedCountries.has(countryName))
                        addCountry();
                      else
                        deleteCountry();
                      }
                  }}
                style={{
                  default: {
                    fill: isSelected ? "#FF5722" : "#D6D6DA",
                    outline: "none",
                  },
                  hover: {
                    fill: "#F53",
                    outline: "none",
                  },
                  pressed: {
                    fill: "#E42",
                    outline: "none",
                  },
                }}
              />
            );
          })
        }
      </Geographies>
      </ZoomableGroup>
    </ComposableMap>
    <div id="map" style={{ width: "100%", height: "100%" }}>
    </div>
  </div>
  );
};

export default MapUI;
