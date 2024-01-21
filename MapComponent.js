import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import polyline from '@mapbox/polyline';
import 'mapbox-gl/dist/mapbox-gl.css';

// Make sure to replace this with your actual Mapbox access token
mapboxgl.accessToken = 'ACCESS-TOKEN';

const MapComponent = ({ route }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    // Initialize map only once
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-73.9723,40.7648], // Default center on New York Central Park
      zoom: 14
    });

    // Add navigation control (zoom and rotation controls)
    map.addControl(new mapboxgl.NavigationControl());

    // Decode polyline and add route on the map
    if (route && route.geometry) {
      map.on('load', () => {
        const decodedData = polyline.toGeoJSON(route.geometry);
        
        if (map.getSource('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }

        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: decodedData
          }
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#ff0000',
            'line-width': 12
          }
        });

        // Fit map to route bounds
        const bounds = new mapboxgl.LngLatBounds();
        decodedData.coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds, { padding: 20 });
      });
    }

    // Clean up on unmount
    return () => map.remove();
  }, [route]);

  return <div className="map-container" ref={mapContainerRef} style={{ height: '400px' }} />;
};

export default MapComponent;