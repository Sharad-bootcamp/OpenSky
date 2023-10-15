const aviationEdgeApiKey = '797861-9a1ddb'; // Replace with your Aviation Edge API key
const map = L.map('map').setView([-34.000233, 138.209152], 7); // Set initial map center and zoom level
const aviationEdgeBaseUrl = 'https://aviation-edge.com/v2/public/flights';
const aviationEdgeAirlineBaseUrl = 'https://aviation-edge.com/v2/public/airlineDatabase';

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
          // Clear existing options from the dropdown.
          while (airlineDropdown.firstChild) {
              airlineDropdown.removeChild(airlineDropdown.firstChild);
          }

          // Create a set to store unique airline ICAO codes.
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
                // Create an array to store airline name and ICAO code pairs.
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

// Populate the airport dropdown using Aviation Edge API.
const airportDropdown = document.getElementById('airportDropdown');

function fetchAndPopulateAirportDropdown() {
    const bounds = map.getBounds();
    const url2 = `${aviationEdgeBaseUrl}?key=${aviationEdgeApiKey}`;
  
    fetch(url2)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Clear existing options from the dropdown.
            while (airportDropdown.firstChild) {
                airportDropdown.removeChild(airportDropdown.firstChild);
            }
  
            // Create a set to store unique airport IATA codes.
            const airportsWithinBounds = new Set();
  
            data.forEach(flight => {
                if (flight.geography && flight.geography.latitude && flight.geography.longitude) {
                    const lat = flight.geography.latitude;
                    const lon = flight.geography.longitude;
  
                    // Check if the flight is within the visible map area.
                    if (bounds.contains([lat, lon])) {
                        airportsWithinBounds.add(flight.departure.iataCode);
                        // console.log(airportsWithinBounds)
                    }
                }
            });
  
            // Fetch airport names from the airport database.
            fetch(`https://aviation-edge.com/v2/public/airportDatabase?key=${aviationEdgeApiKey}`)
                .then(response => response.json())
                .then(airportData => {
                    console.log(airportData)
                    // Create an array to store airport name and IATA code pairs.
                    const airportOptions = [];
    
                    // Populate the array with matching pairs.
                    airportsWithinBounds.forEach(iataCode => {
                        const matchingAirport = airportData.find(airport => airport.codeIataAirport === iataCode);
                        if (matchingAirport) {
                            airportOptions.push({
                                value: iataCode,
                                text: matchingAirport.nameAirport,
                            });
                        }
                    });
                        // Sort the airport options alphabetically by airport name.
                        airportOptions.sort((a, b) => a.text.localeCompare(b.text));
    
                        // Populate the dropdown with sorted airport names.
                        airportOptions.forEach(option => {
                            const newOption = document.createElement('option');
                            newOption.value = option.value;
                            newOption.text = option.text;
                            airportDropdown.appendChild(newOption);
                        });
                    })
                    .catch(error => console.error('Error fetching airport data:', error));
            })
            .catch(error => console.error('Error fetching flight data:', error));
  }


// Function to fetch delayed flight data
const selectedAirport = airportDropdown.value;
function fetchDelayedFlights(selectedAirport) {
    // Get the current date
    var currentDate = new Date();

    // Subtract 1 day from the current date
    currentDate.setDate(currentDate.getDate() - 5);

    // Get the year, month, and day components
    var year = currentDate.getFullYear();
    var month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    var day = String(currentDate.getDate()).padStart(2, '0');

    // Format the date as "YYYY-MM-DD"
    const formattedDate = `${year}-${month}-${day}`;

    // due to inconsistency in the source api, Adelaide Aiport has been set as static for this exercise

    fetch(`https://aviation-edge.com/v2/public/flightsHistory?key=${aviationEdgeApiKey}&code=ADL&type=departure&date_from=${formattedDate}`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // Get the table body element
        const tableBody = document.querySelector('#flightTable tbody');

        // Clear existing data in the table.
        tableBody.innerHTML = '';

        // Iterate through the response data and populate the table.
        data.forEach(flight => {
            const row = document.createElement('tr');
            row.innerHTML = `
            <td>${flight.flight.number}</td>
            <td>${flight.airline.name}</td>
            <td>${flight.departure.delay}</td>
            <td>${flight.arrival.scheduledTime}</td>
            `;
            tableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching flight data:', error));
}

// Call the function to fetch and populate the data
fetchDelayedFlights();

// Call the function to initially populate the dropdown with airport names within the visible map area.
fetchAndPopulateAirportDropdown();

// Call the function to initially populate the dropdown with airline names within the visible map area.
fetchAndPopulateAirlineDropdown();

// Add an event listener to the dropdown to handle changes.
airlineDropdown.addEventListener('change', function () {
    const selectedAirline = airlineDropdown.value;
    fetchDelayedFlights(selectedAirline);
});

// Add an event listener to the dropdown to handle changes.
airportDropdown.addEventListener('change', function () {
    const selectedAirport = airportDropdown.value;
    fetchAndDisplayFlights(selectedAirport);
});
      
// Call the function to fetch and display flights
fetchAndDisplayFlights();