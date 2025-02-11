const windyOptions = {
    key: 'oaJ6HgyJyJQB0GxAJA1S0EEKaG4dpOd5', // Replace with your Windy API key
    lat: 34.5281, // Center latitude for Kabul
    lon: 69.1723, // Center longitude for Kabul
    zoom: 6, // Initial zoom level
};

windyInit(windyOptions, (windyAPI) => {
    const { map, store } = windyAPI;

    // Set the overlay to PM10 (air pollution data)
    store.set('overlay', 'pm10');

    // Set the map view to focus only on Afghanistan
    const afghanistanBounds = [
        [29.3772, 60.8728], // Southwest coordinates of Afghanistan
        [38.4911, 74.8899], // Northeast coordinates of Afghanistan
    ];
    map.fitBounds(afghanistanBounds); // Restrict the view to Afghanistan bounds

    // Limit the zoom levels
    map.options.minZoom = 6;
    map.options.maxZoom = 10;

    // Prevent the map from panning outside the Afghanistan bounds
    map.setMaxBounds(afghanistanBounds);

    // Add a marker in Kabul
    const marker = L.marker([34.5281, 69.1723]).addTo(map);
    marker.bindPopup("<strong>Kabul</strong><br>PM2.5: 150 µg/m³").openPopup();
});