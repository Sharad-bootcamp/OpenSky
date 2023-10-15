const aviationEdgeApiKey = '797861-9a1ddb'; // Replace with your Aviation Edge API key
const map = L.map('map').setView([-34.000233, 138.209152], 7); // Set initial map center and zoom level
const aviationEdgeBaseUrl = 'https://aviation-edge.com/v2/public/flights';
const aviationEdgeAirlineBaseUrl = 'https://aviation-edge.com/v2/public/airlineDatabase';
const aviationEdgeFlightshistoryUrl = 'https://aviation-edge.com/v2/public/flightsHistory';

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Populate the airline dropdown using Aviation Edge API.
const airlineDropdown = document.getElementById('airlineDropdown');

function fetchAndPopulateAirlineDropdown() {
  const bounds = map.getBounds();
  const url = `${aviationEdgeBaseUrl}?key=${aviationEdgeApiKey}`;

  fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
          // Clear existing options from the dropdown.
          while (airlineDropdown.firstChild) {
              airlineDropdown.removeChild(airlineDropdown.firstChild);
          }

          // Create a set to store unique airline IATA codes.
          const airlinesWithinBounds = new Set();

          data.forEach(flight => {
              if (flight.geography && flight.geography.latitude && flight.geography.longitude) {
                  const lat = flight.geography.latitude;
                  const lon = flight.geography.longitude;

                  // Check if the flight is within the visible map area.
                  if (bounds.contains([lat, lon])) {
                      airlinesWithinBounds.add(flight.airline.icaoCode);
                  }
              }
          });

          // Fetch airline names from the airline database.
          fetch(`https://aviation-edge.com/v2/public/airlineDatabase?key=${aviationEdgeApiKey}`)
              .then(response => response.json())
              .then(airlineData => {
                // Create an array to store airline name and IATA code pairs.
                const airlineOptions = [];

                // Populate the array with matching pairs.
                airlinesWithinBounds.forEach(icaoCode => {
                  const matchingAirline = airlineData.find(airline => airline.codeIcaoAirline === icaoCode);
                  if (matchingAirline) {
                      airlineOptions.push({
                          value: icaoCode,
                          text: matchingAirline.nameAirline,
                      });
                  }
              });
                   // Sort the airline options alphabetically by airline name.
                   airlineOptions.sort((a, b) => a.text.localeCompare(b.text));

                   // Populate the dropdown with sorted airline names.
                   airlineOptions.forEach(option => {
                       const newOption = document.createElement('option');
                       newOption.value = option.value;
                       newOption.text = option.text;
                       airlineDropdown.appendChild(newOption);
                   });
               })
              .catch(error => console.error('Error fetching airline data:', error));
      })
      .catch(error => console.error('Error fetching flight data:', error));
}

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

// Function to fetch delayed flight data
async function fetchDelayedFlights() {
    try {
        const response = await fetch(`${aviationEdgeBaseUrl}?key=${aviationEdgeApiKey}`);
        const data = await response.json();

        // Get the table body element
        const tableBody = document.querySelector('#flightTable tbody');

        // Iterate through the data and populate the table
        data.forEach(flight => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${flight.flight.icaoNumber}</td>
                <td>${flight.departure.iataCode}</td>
                <td>${flight.arrival.iataCode}</td>
                <td>${flight.status}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// Call the function to fetch and populate the data
fetchDelayedFlights();

// Filter the table based on visible markers on the map
map.on('moveend', () => {
    const visibleFlights = [];
    const bounds = map.getBounds();

    const tableRows = document.querySelectorAll('#flightTable tbody tr');
    tableRows.forEach(row => {
        const latitude = parseFloat(row.querySelector('td:nth-child(4)').textContent);
        const longitude = parseFloat(row.querySelector('td:nth-child(5)').textContent);

        if (bounds.contains([latitude, longitude])) {
            visibleFlights.push(row);
        }
    });

    // Hide all rows first
    tableRows.forEach(row => {
        row.style.display = 'none';
    });

    // Display only the visible rows
    visibleFlights.forEach(row => {
        row.style.display = '';
    });
});


// Call the function to initially populate the dropdown with airline names within the visible map area.
fetchAndPopulateAirlineDropdown();

// Add an event listener to the dropdown to handle changes.
airlineDropdown.addEventListener('change', function () {
    const selectedAirline = airlineDropdown.value;
    fetchAndDisplayFlights(selectedAirline);
});
      
// Call the function to fetch and display flights
fetchAndDisplayFlights();
