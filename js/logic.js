
const aviationEdgeApiKey = '8927db-6d3716'; // Replace with your Aviation Edge API key
const map = L.map('map').setView([-34.000233, 138.209152], 7); // Set initial map center and zoom level
const aviationEdgeBaseUrl = 'https://aviation-edge.com/v2/public/flights';
const aviationEdgeAirlineBaseUrl = 'https://aviation-edge.com/v2/public/airlineDatabase';

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Populate the airline dropdown using Aviation Edge API.
const airlineDropdown = document.getElementById('airlineDropdown');

fetch(`https://aviation-edge.com/v2/public/airlineDatabase?key=${aviationEdgeApiKey}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(airline => {
            const option = document.createElement('option');
            option.value = airline.codeIcaoAirline;
            option.text = airline.nameAirline;
            airlineDropdown.appendChild(option);
        });
    })
    .catch(error => console.error('Error fetching airline data:', error));

// Function to fetch and display flights based on the selected airline.
function fetchAndDisplayFlights() {
    const selectedAirline = airlineDropdown.value;
    const url = selectedAirline
        ? `${aviationEdgeBaseUrl}?airlineIcao=${selectedAirline}&key=${aviationEdgeApiKey}`
        : `${aviationEdgeBaseUrl}?key=${aviationEdgeApiKey}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Clear existing markers from the map.
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        data.forEach(flight => {
            if (flight.geography && flight.geography.latitude && flight.geography.longitude) {
                // Determine the icon based on the flight status
                let iconUrl = 'default-icon.png'; // Default icon
                if (flight.status) {
                  if (flight.status === 'en-route') {
                    iconUrl = 'Images/airplane_red.png';
                  } else if (flight.status === 'landed') {
                    iconUrl = 'Images/airplane_blue.png';
                  } else if (flight.status === 'started') {
                    iconUrl = 'Images/airplane_yellow.png';
                  } else {iconUrl = 'Images/airplane_black.png';
                    }
                }
      
                // Create a custom icon for the markers
                const customIcon = L.icon({
                  iconUrl: iconUrl, // Set the icon based on status
                  iconSize: [18, 18], // Set the icon size (width, height) in pixels
                  iconAnchor: [12, 12], // Set the anchor point of the icon
                });
      
                // Add a marker to the map with the custom icon
                const marker = L.marker(
                  [flight.geography.latitude, flight.geography.longitude],
                  { icon: customIcon }
                )
                  .addTo(map)
                  .bindPopup(`Flight Number: ${flight.flight.icaoNumber}<hr>Altitude: ${flight.geography.altitude} feet<br>Status: ${flight.status}`);
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching flight data:', error);
    });
}


// Add an event listener to the dropdown to handle changes.
airlineDropdown.addEventListener('change', function () {
    const selectedAirline = airlineDropdown.value;
    fetchAndDisplayFlights(selectedAirline);
});
      
// Call the function to fetch and display flights
fetchAndDisplayFlights();
