// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add the base tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// Fetch earthquake data from the URL
fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
  .then(response => response.json())
  .then(data => {
    // Loop through earthquake features and create markers
    data.features.forEach(feature => {
      var coords = feature.geometry.coordinates;
      var mag = feature.properties.mag;
      var depth = coords[2];
      var color = getColor(depth);

      // Create a marker with popup
      var marker = L.circleMarker([coords[1], coords[0]], {
        radius: mag * 3,
        fillColor: color,
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      marker.bindPopup(
        `<strong>Magnitude: ${mag}</strong><br>Depth: ${depth} km`
      );
    });
  });

// Define a function to determine color based on depth
function getColor(depth) {
  if (depth < 10) return '#1a9850';
  else if (depth < 30) return '#91cf60';
  else if (depth < 70) return '#d9ef8b';
  else if (depth < 150) return '#fee08b';
  else return '#fc8d59';
}

// Add a legend
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'info legend');
  var depths = [0, 10, 30, 70, 150];
  var labels = [];

  for (var i = 0; i < depths.length; i++) {
    labels.push(
      '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
      depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+')
    );
  }

  div.innerHTML = labels.join('<br>');
  return div;
};
legend.addTo(map);
