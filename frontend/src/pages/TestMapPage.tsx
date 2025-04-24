// TestMapPage.tsx

import React from "react";
import MapExplorer from "../components/MapExplorer";

export default function TestMapPage() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Map Click-Toggle Demo</h1>
      <p>Click any country to mark/unmark it.</p>
      <MapExplorer />
    </div>
  );
}
