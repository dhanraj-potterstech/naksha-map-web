import React from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';


mapboxgl.accessToken = 'pk.eyJ1IjoiamFuc2Fqb3NlIiwiYSI6ImNrbmlmenZ4NjJ1aWoycGxjdG1qbGhwY2wifQ.waif_7e7ELIHRq8HH7OuVw';

export default function App() {
  const mapContainer = React.useRef(null);
  const map = React.useRef(null as any);
  const [lng, setLng] = React.useState(78.499);
  const [lat, setLat] = React.useState(17.45671);
  const [zoom, setZoom] = React.useState(14);

  React.useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: zoom
    }) as mapboxgl.Map;

    // add geo coder
    map.current.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl
      })
    );

    
    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Clean up on unmount
    // return () => map.current.remove();
  });

  React.useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  }, []);

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

