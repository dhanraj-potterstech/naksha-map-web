import React from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

import { useGetPlacesImagesMutation } from "../../services/places";
import MapPopUp from "./MapPopUp";
import PopupContent from "./PopupContent";
import markerImage from "../../assets/images/marker-circle.png"
import { Box, VStack } from "@chakra-ui/react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiamFuc2Fqb3NlIiwiYSI6ImNrbmlmenZ4NjJ1aWoycGxjdG1qbGhwY2wifQ.waif_7e7ELIHRq8HH7OuVw";

export default function Dashboard() {
  /* ++++++++++ Function State ++++++++++ */
  // const [lng, setLng] = React.useState(-87.637596);
  // const [lat, setLat] = React.useState(41.940403);
  const [lng, setLng] = React.useState(78.5315949);
  const [lat, setLat] = React.useState(17.3521068);
  const [zoom, setZoom] = React.useState(14);
  const [popUpData, setPopUpData] = React.useState({
    showModal: false,
    feature: null
  })
  /* ---------- Function State ---------- */

  /* ++++++++++ Function Constants ++++++++++ */
  const mapContainer = React.useRef(null);
  const map = React.useRef(null as any);
  const [doGetPlacesImages, { isLoading, data: responseData, isError }] = useGetPlacesImagesMutation()
  /* ---------- Function Constants ---------- */

  /* ++++++++++ Side Effects ++++++++++ */
  React.useEffect(() => {
    if (lat && lng && !isLoading) {
      doGetPlacesImages({ latitude: lat, longitude: lng })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng])

  React.useEffect(() => {
    if (!responseData || !responseData.data) return
    initMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responseData])
  /* ---------- Side Effects ---------- */

  /* ++++++++++ Function Methods ++++++++++ */
  const initMap = () => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: 'map-container',
      style: "mapbox://styles/mapbox/streets-v12",
      center: [lng, lat],
      zoom: zoom,
    }) as mapboxgl.Map;

    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    })

    // add geo coder
    map.current.addControl(geocoder);
    geocoder.on('result', e => {
      console.log('geocoder.on', e.result.center);
      setLng(e.result.center[0].toFixed(4));
      setLat(e.result.center[1].toFixed(4));
    });

    // Add navigation control (the +/- zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on('error', (e: any) => {
      console.log('A error event occurred.', e);
    });

    map.current.on("load", () => {
      console.log('map.current.on load')
      map.current.resize()
      // Add an image to use as a custom marker
      map.current.loadImage(
        markerImage,
        function (error: any, image: any) {
          if (error) throw error;
          map.current.addImage("custom-marker", image,);

          // Add a GeoJSON source with multiple points
          map.current.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: responseData.data,
            },
          });
          // Add a symbol layer
          map.current.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "name"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });

          map.current.flyTo({
            center: responseData.data[0].geometry.coordinates
          });

          // When a click event occurs near a marker icon, open a popup at the location of
          // the feature, with description HTML from its properties.
          map.current.on('click', 'points', function (e: any) {
            var features = map.current.queryRenderedFeatures(e.point, { layers: ['points'] });
            if (!features.length) {
              return;
            }
            var feature = features[0];
            setPopUpData((prevState) => ({ ...prevState, showModal: true, feature }))
          });
          // Use the same approach as above to indicate that the symbols are clickable
          // by changing the cursor style to 'pointer'.
          map.current.on('mousemove', function (e: any) {
            var features = map.current.queryRenderedFeatures(e.point, { layers: ['points'] });
            map.current.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
          });
        }
      );
    });
  }

  const onClickNext = () => {
    const feature: any = popUpData.feature
    if (!feature) return
    const id = responseData.data.findIndex(
      (f: any) => f.properties.id === feature.properties.id
    )
    if (id < 0 || !responseData.data[id + 1]) return

    setPopUpData((prevState) => ({ ...prevState, feature: responseData.data[id + 1] }))
  }
  const onClickPrev = () => {
    const feature: any = popUpData.feature
    if (!feature) return
    const id = responseData.data.findIndex(
      (f: any) => f.properties.id === feature.properties.id
    )
    if (id - 1 < 0 || !responseData.data[id - 1]) return

    setPopUpData((prevState) => ({ ...prevState, feature: responseData.data[id - 1] }))
  }
  const onPopupClose = () => { setPopUpData((prevState) => ({ ...prevState, showModal: false, feature: null })) }
  /* ---------- Function Methods ---------- */

  /* ++++++++++ Function Render Methods ++++++++++ */
  /* ---------- Function Render Methods ---------- */
  // console.log({ isLoading, isError, responseData, })
  return (
    <>
      <VStack bg='gray.200' h='100vh' margin='auto' justify='center'>
        <Box w='96vw' color='black'>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | {isLoading ? 'Loading places' : ''}
        </Box>
        <Box id="map-container" ref={mapContainer} />
      </VStack>
      <MapPopUp
        isOpen={popUpData.showModal}
        feature={popUpData.feature}
        onClickPrev={onClickPrev}
        onClickNext={onClickNext}
        onClose={onPopupClose}
      />
    </>
  );
}
