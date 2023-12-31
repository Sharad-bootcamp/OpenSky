# Project 3 - Aviation Edge Flight Tracking Map

## A dymanic leaflet map drawing on API endpoints sourced from [Aviation Edge](https://aviation-edge.com/developers/)


![Flight_Tracking](Images/full_page.png)


### Airplane Colours

| Colour | Red | Yellow | Blue | Black |
| ----------- | :-----------: | :-----------: | :-----------: | :-----------: |
| **Icon** | <img src="Images/airplane_red.png" width="50" height="50"> | <img src="Images/airplane_yellow.png" width="50" height="50"> | <img src="Images/airplane_blue.png" width="50" height="50"> | <img src="Images/airplane_black.png" width="50" height="50"> |
| **Status** | en-route | started | landed | other |


## User Driven View

**Users can adjust the span of information by zooming in and out on the map or click and drag to different geographical areas to view current flight information within the visible map area.**

![World_View](Images/world.PNG)


**Users can further filter the map by slecting an airline from the dropdown box.  The dropdown box is filtered based on airlines that have flights visible in the current map bounds.**

![Airline](Images/airline_dropdown.png)


**Users are presented with a scrollable list of historical flight delay information for the last five (5) days related to the airport the user selects from the dropdown.**

![list](Images/scrollable_list.PNG)

## API Endpoints Use and Purpose

Flight details that populate the map:

https://aviation-edge.com/v2/public/flights


Airline database to populate the Airlines dropdown box:

https://aviation-edge.com/v2/public/airlineDatabase


Airports database to populate the Airports dropdown box:

https://aviation-edge.com/v2/public/airportDatabase


Flights History to populate the Flight Delays Table based on the selected airport:

https://aviation-edge.com/v2/public/flightsHistory


The data provided by Aviation Edge API was available paying a fee suscription. These insights were obtained from live tracking flights to actual airport schedules, airline routes aggregated from our various data partners around the world and presented to our clients through Flight Radar API.

Upon meticulous data modelling to enhance our comprehension, we have drawn the following key conclusions:

### *Rate Limits: 
Users of the Aviation Edge API need to be mindful of rate limits, which restrict the number of requests within specific timeframes. Exceeding these limits may lead to temporary blocks or usage restrictions. It's essential to plan requests carefully and efficiently to avoid disruptions in service.

### *Data Freshness: 
While the API provides real-time data, it's important to acknowledge that there might be slight delays due to the processing and updating of information. Users should be aware of this delay when relying on the API for time-sensitive applications and make appropriate allowances for potential lag.

### *Limited Free Tier: 
Careful evaluation of their specific needs and budget is advised to make an informed choice.

### *Data Coverage: 
The API's coverage of certain data types, such as airports, airlines, and flights, as well as geographical regions, may vary. Some data may be more comprehensive in specific areas compared to others. Users should assess whether the available data aligns with their requirements.

### *Limited Customer Support for Free Tiers: 
Free-tier users of the API might experience limited access to customer support. Responses from support may take longer compared to paid users who typically receive higher priority assistance. This should be considered when evaluating the level of support needed for your use case.


## Challenges with source APIs

When working with live api endpoints, there is always a reliance on the information in the endpoint being up to date and complete however, this is not always the case.

As at the time of submitting this project for assessment and after raising a support enquiry with Aviation Edge, we have found that there is key information missing from the Flight Tracking API endpoint critical to enabling the full utilisation of our developed webpage.  

Dependencies:

* To enable the filtering of the airline dropdown based on airlines visible in the current map area, the airlines database is filtered using the airline IATA code for each airline visible in the map area.  As the Airline IATA code is currently missing from the Flight Tracker API, we are not able to acurately show the list of visible airlines however, once the api data is corrected, the webpage will auto correct itself and populate the airlines dropdown box without additional coding required.

* As is the case with the airlines dropdown, to enable filtering of the airports dropdown based on airports visible in the current map area, the airports database is filtered based on the departure airport IATA code which is also currently missing from the Flight Tracker API.  To enable demonstration of the flight delays table, we have hard coded the airport parameter to show ADL (Adelaide Internation Airport) delay information.  The javascript coding will need to be adjusted to use the "selectedAirport" constant within the API url once the missing information is avialble.


*Following is a screen shot of the enquiry and response from Aviation Edge support:*

<img src="Images/Enquiry.png" width="600" height="800">


<img src="Images/Console_Log.PNG" width="400" height="400">  |  <img src="Images/API_endpoint.PNG" width="400" height="400">
