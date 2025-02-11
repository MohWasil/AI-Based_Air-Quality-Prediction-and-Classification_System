const windyOptions = {
    key: 'oaJ6HgyJyJQB0GxAJA1S0EEKaG4dpOd5', // Replace with your API key
    lat: 50.4, // Latitude
    lon: 14.3, // Longitude
    zoom: 5, // Zoom level
};

// Initialize Windy
windyInit(options, (windyAPI) => {
    const { map } = windyAPI; // Access the map object

    // Disable only scroll zoom
    map.scrollWheelZoom.disable();

    // Attach the map to the custom div
    const mapContainer = document.getElementById('windy');
    mapContainer.appendChild(map.getContainer());

    // Example layer for PM2.5
    const pm25Layer = windyAPI.store.get('pm25');
    pm25Layer.setActive(true); // Activate the layer
});