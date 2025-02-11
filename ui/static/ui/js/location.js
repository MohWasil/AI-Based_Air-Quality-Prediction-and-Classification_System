// Fetch user's location using a geolocation API
var theMonster = "";
fetch("https://ipinfo.io/json?token=83749eeb0af037") // Replace 'YOUR_TOKEN' with your API token from ipinfo.io
  .then((response) => response.json())
  .then((data) => {
    const country = data.country; // Get country code
    const city = data.city; // Get city name
    var loc = data.loc;
    var latitude = loc.split(",")[0];
    var longitude = loc.split(",")[1];
    const locationInfo = `Welcome, Country: <strong>${country}</strong> | City: <strong>${city}</strong>`;
    document.getElementById("location-info").innerHTML = locationInfo; // Update HTML with location
    fetch(`/api/predict/predict/?country=${country}&state=${city}&latitude=${latitude}&longitude=${longitude}`, {
      // method: "POST",
      // headers: { "content-type": "Application/json" },
    }).then((res) => res.json().then((data) => {

    }));
  })
  .catch((error) => {
    console.error("Error fetching location:", error);
    document.getElementById("location-info").innerHTML =
      "Location information could not be retrieved.";
  });
