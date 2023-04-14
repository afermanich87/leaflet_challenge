

//var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";


// Creating the map object
let myMap = L.map("map", {
    center: [40, -110],
    zoom: 5
  });
  
  // Add the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Use this link to get the GeoJSON data.
  let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
  
   
function chooseColor(earthquakeDepth) {
    if (earthquakeDepth >= 90) return "Red";
    else if (earthquakeDepth >= 70 & earthquakeDepth < 90) return "DarkOrange"
    else if (earthquakeDepth >= 50 & earthquakeDepth < 70) return "Orange"
    else if (earthquakeDepth >= 30 & earthquakeDepth < 50) return "Yellow"
    else if (earthquakeDepth >= 10 & earthquakeDepth < 30) return "YellowGreen"
    else if (earthquakeDepth >= -10 & earthquakeDepth < 10) return "Green"
    else return "Grey"
}
 

 // Create Circle Markers
function markerCircle(point, latlng) {
    let earthquakeMag = point.properties.mag;
    let earthquakeDepth = point.geometry.coordinates[2];
    return L.circle(latlng, {
            color: chooseColor(earthquakeDepth),
            fillColor: chooseColor(earthquakeDepth),
            fillOpacity: 0.3,
            radius: earthquakeMag * 15000
    })
}

// Create Popup 
function bindPopUp(feature, layer) {
    layer.bindPopup(`Location: ${feature.properties.place} <br>
                     Magnitude: ${feature.properties.mag} <br> 
                     Depth: ${feature.geometry.coordinates[2]}`);
}


// Retrieve Data From GeoJSON API
d3.json(queryUrl).then(function (data) {
    var features = data.features;

    // Add Data to Map
    L.geoJSON(features, {
        pointToLayer: markerCircle,
        onEachFeature: bindPopUp
    }).addTo(myMap);


    //add legend
    let legend = L.control({ position: 'bottomleft' });

    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        range = [-10, 10, 30, 50, 70, 90];

        // Set Square Color For Each Bracket In Legend
        for (let i = 0; i < range.length; i++) {
            div.innerHTML += '<i style="background:' + chooseColor(range[i] + 1) + '"></i> ' + range[i] + (range[i + 1] ? ' to ' + range[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);

});