// // Sample Data for Air Quality Visualization
// var trace1 = {
//     x: ['2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01'],
//     y: [65, 75, 60, 80, 90],
//     mode: 'lines+markers',
//     name: 'PM2.5 Levels',
//     line: { color: 'blue', width: 2 }
// };

// var trace2 = {
//     x: ['2024-01-01', '2024-02-01', '2024-03-01', '2024-04-01', '2024-05-01'],
//     y: [45, 50, 55, 70, 85],
//     mode: 'lines',
//     name: 'PM10 Levels',
//     line: { color: 'orange', dash: 'dash' }
// };

// var layout = {
//     title: 'Air Quality Index Over Time',
//     xaxis: {
//         title: 'Date',
//         showgrid: true
//     },
//     yaxis: {
//         title: 'AQI Levels',
//         range: [0, 100]
//     },
//     legend: {
//         orientation: "h",
//         y: -0.2
//     }
// };

// Plotly.newPlot('plotlyChart', [trace1, trace2], layout);


// Example static data (can be replaced with API response)
const airQualityData = [
    { level: "Good", description: "Air quality is satisfactory and poses little or no risk.", category: "good" },
    { level: "Moderate", description: "Air quality is acceptable; however, there may be some health concern for sensitive groups.", category: "moderate" },
    { level: "Unhealthy", description: "Air quality is poor. Everyone may begin to experience health effects.", category: "unhealthy" }
];

// Function to render air quality cards dynamically
function renderAirQualityCards(data) {
    const container = document.querySelector('.air-quality-section');
    container.innerHTML = ''; // Clear existing cards

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = `col-md-4`;
        card.innerHTML = `
                <div class="air-quality-card ${item.category}">
                    <h4>${item.level}</h4>
                    <p>${item.description}</p>
                </div>
            `;
        container.appendChild(card);
    });
}

// Render static data
renderAirQualityCards(airQualityData);

// Example API integration (replace URL with a real API)
/*
fetch('https://api.example.com/air-quality')
    .then(response => response.json())
    .then(data => renderAirQualityCards(data))
    .catch(error => console.error('Error fetching air quality data:', error));
*/

// Polt.js

// Fetch user's location using a geolocation API
fetch('https://ipinfo.io/json?token=83749eeb0af037') // Replace 'YOUR_TOKEN' with your API token from ipinfo.io
    .then(response => response.json())
    .then(data => {
        const country = data.country; // Get country code
        const city = data.city; // Get city name
        const locationInfo = `Welcome, Country: <strong>${country}</strong> | City: <strong>${city}</strong>`;
        document.getElementById('location-info').innerHTML = locationInfo; // Update HTML with location
    })
    .catch(error => {
        console.error('Error fetching location:', error);
        document.getElementById('location-info').innerHTML = 'Location information could not be retrieved.';
    });


