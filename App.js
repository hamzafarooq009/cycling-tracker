import React, { useState } from 'react';
import RouteFinder from './RouteFinder';
import MapComponent from './MapComponent'; // Import MapComponent

function App() {
  const [route, setRoute] = useState(null);

  return (
    <div className="App">
      <h1>Cycling Route Finder</h1>
      <RouteFinder setRoute={setRoute} />
      <MapComponent route={route} />
    </div>
  );
}

export default App;