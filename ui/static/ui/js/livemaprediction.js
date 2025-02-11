// Initialize the map with Afghanistan's center and zoom level
const map = L.map('map', {
    center: [33.0, 65.0], // Afghanistan coordinates
    zoom: 6, // Initial zoom level
    minZoom: 6, // Minimum zoom level
    maxZoom: 10, // Maximum zoom level
    maxBounds: [ // Restrict map bounds to Afghanistan
        [29.0, 60.0], // Southwest corner
        [38.0, 75.0]  // Northeast corner
    ]
});

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Example PM2.5 data (sample locations in Afghanistan)
const pm25Data = [
    { lat: 34.5553, lon: 69.2075, city: "Kabul", pm25: 120 }, // Example for Kabul
    { lat: 31.6106, lon: 65.7101, city: "Kandahar", pm25: 85 },
    { lat: 36.728, lon: 68.857, city: "Mazar-i-Sharif", pm25: 95 }
];

// Add markers for each location
pm25Data.forEach(location => {
    const marker = L.marker([location.lat, location.lon]).addTo(map);
    marker.bindPopup(`
                <strong>${location.city}</strong><br>
                <strong>PM2.5:</strong> ${location.pm25}<br>
                ${getAirQualityStatus(location.pm25)}
            `);
});

// Function to determine air quality status
function getAirQualityStatus(pm25) {
    if (pm25 <= 50) return "Good";
    if (pm25 <= 100) return "Moderate";
    if (pm25 <= 150) return "Unhealthy for Sensitive Groups";
    if (pm25 <= 200) return "Unhealthy";
    if (pm25 <= 300) return "Very Unhealthy";
    return "Hazardous";
}