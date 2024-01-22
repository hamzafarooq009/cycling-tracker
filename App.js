import React, { useState, useLayoutEffect } from 'react';

import RouteFinder from './RouteFinder';
import MapComponent from './MapComponent';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported



function App() {
  const [route, setRoute] = useState(null);

  useLayoutEffect(() => {
    document.body.style.background = "linear-gradient(90deg, hsla(234, 80%, 88%, 1) 0%, hsla(340, 68%, 88%, 1) 93%, hsla(342, 72%, 85%, 1) 100%)";
  });

  return (
    <div className="App">
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-12 p-0">
            <header className="app-header text-center py-1 bg-white">
            <img 
                src="https://www.educative.io/udata/Xxr7rxL66OW/cycling-route-finder-logo.png"
                alt="Cycling Route Finder Logo" 
                style={{ maxWidth: '150px', height: 'auto' }}
              />
            </header>
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-0">
            <MapComponent route={route} />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <RouteFinder setRoute={setRoute} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
