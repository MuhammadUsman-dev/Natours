/* eslint-disable */

export const displayMap = function (locations) {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidXNtYW5zaHVqYSIsImEiOiJja3RzaDBwaTAxZzB4Mm9tcHdxNDNreWlzIn0.I8Vum_uEwu_p-oYcCMl-xw';
  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    scrollZoom: false,
  });
  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((loc) => {
    // create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p> ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });

  map.on('style.load', () => {
    map.setFog({}); // Set the default atmosphere style
  });
};
