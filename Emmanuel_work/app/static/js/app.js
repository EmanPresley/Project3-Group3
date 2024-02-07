
// select the dropdown
let dropdown = d3.selectAll("#dropdown").attr("selected", "selected");

// add an event listener for a CHANGE
dropdown.on("change", function () {
  let selectedValue = dropdown.value;
  
  // on change, do work
  doWork();
});

// get the new data
function doWork() {
  let inp_state = dropdown.property("value");

  // grab the data
  let url = `/api/v1.0/${inp_state}`;

  // make request
  d3.json(url).then(function (data) {
    console.log(data);

    makeMap(data);
    makeBar(data);
    //make metadata chart
    makeMeta(data);
  });
}

function makeMap(data) {
  // Step 0: recreate the map html
  // Select the map_container div
  let mapContainer = d3.select("#map_container");

  // Empty the map_container div
  mapContainer.html("");

  // Append a div with id "map" inside the map_container div
  mapContainer.append("div").attr("id", "map");

  // Step 1: Define your BASE Layers

  // Define variables for our tile layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Step 2: Create the OVERLAY (DATA) Layers
  // Create a new marker cluster group.
  let markerLayer = L.markerClusterGroup();
  let markers = [];

  // Loop through the data.
  for (let i = 0; i < data.map_data.length; i++){

    // Set the data location property to a variable.
    let row = data.map_data[i];

    // Get Lat/Long
    let latitude = row.latitude;
    let longitude = row.longitude;
    let location = [latitude, longitude];

// Add a new marker to the cluster group, and bind a popup.

let marker = L.marker(location).bindPopup(`<h3>${row.Studio}</h3><h4>${row.Country}</h4><h5><a href="#" onclick="window.open('${row["Website"]}', '_blank'); return false;">${row["Website"]}</a></h5>`);

// // Add event listener to the marker
// marker.on('click', function(e) {
//   // Zoom in to the marker's location
//   myMap.setView(e.latlng, 10);
// });

markerLayer.addLayer(marker);

    // for the heatmap
    markers.push(location);
  }

  let heatLayer = L.heatLayer(markers);

  // Step 3: Create the MAP object

  // Create a map object, and set the default layers.
  let myMap = L.map("map", {
    center: [53.649024, 41.290197],
    zoom: 3.5,
    layers: [street, markerLayer]
  });

  // Step 4: Add the Layer Controls (Legend goes here too)

  // Only one base layer can be shown at a time.
  let baseMaps = {
    Street: street,
    Topography: topo
  };

  // Overlays that can be toggled on or off
  let overlayMaps = {
    Markers: markerLayer,
    HeatMap: heatLayer
  };

  // Pass our map layers into our layer control.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}


function makeBar(data) {

  // Trace for the Data
  let trace = {
    x: data.bar_data.map(row => row.num_studios).reverse(),
    y: data.bar_data.map(row => row.Country).reverse(),
    type: "bar",
    orientation: "h",
    marker: {
      color: "red"
    }
  };

  // Data array
  let traces = [trace];

  // Apply a title to the layout
  let layout = {
    title: `Gaming Studios Per Country`,
    margin: { l: 100 },
    
    plot_bgcolor: "3d3867", // Set the background color here
    paper_bgcolor: "3d3867", // Set the border color here
    titlefont: {
      color: "white" // Set the title color here
    }
  };

    layout.xaxis = {
      title: "# of Studios",
      color: "white"

    };
    layout.yaxis = {
      title: "Country",
      color: "white"

    };

  // Render the plot to the div tag with id "plot"
  Plotly.newPlot("bar", traces, layout);

}

function makeMeta(data) {
  let panel = d3.select("#sample-metadata");
  panel.html("");

  //loop through each key in the dictionary 
 
  for (let i = 0; i < 10; i++){
    let row = data.map_data[i];
    panel.append("p").text(`Studio: ${row["Studio"]}`);
    panel.append("p").text(`Country: ${row["Country"]}`);
    panel.append("p").html(`Website: <a href="${row["Website"]}" target = "_blank">${row["Website"]}</a>`);
    panel.append("hr")

  }
}



// INITIALIZE plot on page load
doWork();