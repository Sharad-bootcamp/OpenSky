
const apiKey = '8927db-6d3716'; // Replace with your Aviation Edge API key
const map = L.map('map').setView([-34.000233, 138.209152], 7); // Set initial map center and zoom level

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Function to fetch and display flight data on the map
function fetchAndDisplayFlights() {
  const apiUrl = `https://aviation-edge.com/v2/public/flights?key=${apiKey}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((flight) => {
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

// Call the function to fetch and display flights
fetchAndDisplayFlights();