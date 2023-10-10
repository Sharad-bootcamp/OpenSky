
const apiKey = '8927db-6d3716'; // Replace with your Aviation Edge API key
const map = L.map('map').setView([-34.000233, 138.209152], 7); // Set initial map center and zoom level

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const customIcon = L.icon({
    iconUrl: 'Images/airplane.png', // Replace with the path to your custom icon image
    iconSize: [30, 30], // Set the icon size (width, height) in pixels
    iconAnchor: [16, 16], // Set the anchor point of the icon
  });

// Function to fetch and display flight data on the map
function fetchAndDisplayFlights() {
    const apiUrl = `https://aviation-edge.com/v2/public/flights?key=${apiKey}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        // Loop through the flight data and add markers with custom icons to the map
        data.forEach((flight) => {
          if (flight.geography && flight.geography.latitude && flight.geography.longitude) {
            const marker = L.marker(
              [flight.geography.latitude, flight.geography.longitude],
              { icon: customIcon } // Use the custom icon
            )
              .addTo(map)
              .bindPopup(`Flight: ${flight.flight.icaoNumber}<br>Altitude: ${flight.geography.altitude} feet`);
          }
        });
      })
      .catch((error) => {
        console.error('Error fetching flight data:', error);
      });
}

  // Call the function to fetch and display flights
  fetchAndDisplayFlights();







