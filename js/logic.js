// Initialize the map
var map = L.map('map').setView([0, 0], 2); // Set the initial view

// Add a base layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create a marker cluster group for aircraft markers
var aircraftMarkers = L.markerClusterGroup();

// Function to fetch aircraft data from OpenSky API
function fetchAircraftData() {
    fetch('https://opensky-network.org/api/states/all')
        .then(response => response.json())
        .then(data => {
            // Loop through aircraft data and create markers
            data.states.forEach(function (aircraft) {
                var lat = aircraft[6];
                var lon = aircraft[5];
                var callsign = aircraft[1];

                if (lat && lon && callsign) {
                    // Create a marker for each aircraft
                    var marker = L.marker([lat, lon]).bindPopup(callsign);
                    aircraftMarkers.addLayer(marker);
                }
            });

            // Add the aircraft markers to the map
            map.addLayer(aircraftMarkers);

            // Refresh the data every few seconds
            setTimeout(fetchAircraftData, 3600000000); // Update every 5 seconds
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Call the fetchAircraftData function to start fetching and displaying data
fetchAircraftData();
