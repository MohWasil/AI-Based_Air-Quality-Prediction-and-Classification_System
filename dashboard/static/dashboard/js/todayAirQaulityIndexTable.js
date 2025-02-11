// Sample Data for Air Quality Index
// for (let i = 1; i <= 100; i++) {
//     airQualityIndexData.push({
//         id: i,
//         country: `Country ${i % 10 + 1}`,
//         state: `State ${i % 5 + 1}`,
//         latitude: (Math.random() * 180 - 90).toFixed(4), // Random Latitude
//         longitude: (Math.random() * 360 - 180).toFixed(4), // Random Longitude
//         aqi: Math.floor(Math.random() * 500 + 1), // Random AQI
//         co: (Math.random() * 10).toFixed(2),
//         no: (Math.random() * 10).toFixed(2),
//         no2: (Math.random() * 10).toFixed(2),
//         o3: (Math.random() * 10).toFixed(2),
//         so2: (Math.random() * 10).toFixed(2),
//         pm25: (Math.random() * 50).toFixed(2), // PM2.5
//         pm10: (Math.random() * 50).toFixed(2), // PM10
//         nh3: (Math.random() * 10).toFixed(2),
//         localTime: new Date().toLocaleString(),
//     });
// }

var todayAirQualityIndexData = [];
const todayAirQualityIndexRowsPerPage = 10;
let todayAirQualityIndexCurrentPage = 1;

function todayDisplayAirQualityIndexTable(page) {
  const startIndex = (page - 1) * todayAirQualityIndexRowsPerPage;
  const endIndex = startIndex + todayAirQualityIndexRowsPerPage;
  const tableBody = document.getElementById("todayAirQualityIndexTableBody");

  tableBody.innerHTML = "";
  todayAirQualityIndexData.slice(startIndex, endIndex).forEach((data) => {
    const row = `<tr>
                        <td>${data.id}</td>
                        <td>${data.country}</td>
                        <td>${data.state}</td>
                        <td>${data.latitude.toFixed(2)}</td>
                        <td>${data.longitude.toFixed(2)}</td>
                        <td>${data.aqi}</td>
                        <td>${data.CO.toFixed(2)}</td>
                        <td>${data.NO.toFixed(2)}</td>
                        <td>${data.NO2.toFixed(2)}</td>
                        <td>${data.O3.toFixed(2)}</td>
                        <td>${data.SO2.toFixed(2)}</td>
                        <td>${data.PM25.toFixed(2)}</td>
                        <td>${data.PM10.toFixed(2)}</td>
                        <td>${data.NH3.toFixed(2)}</td>
                        <td>${data.local_time}</td>
                        <td><a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#countryDetailsModal">Read More</a></td>
                    </tr>`;
    tableBody.innerHTML += row;
  });
}

function todaySetupAirQualityIndexPagination() {
  const totalPages = Math.ceil(
    todayAirQualityIndexData.length / todayAirQualityIndexRowsPerPage
  );
  const pagination = document.getElementById("todayAirQualityIndexPagination");

  if (!pagination) {
    console.error("Pagination container not found.");
    return;
  }

  const nextPageElement = document.getElementById("todayAirQualityIndexNextPage");
  if (!nextPageElement) {
    console.error("Element with id 'todayAirQualityIndexNextPage' not found.");
    return;
  }

  // Clear old page links
  const pageLinks = Array.from(
    pagination.querySelectorAll(
      ".page-item:not(#todayAirQualityIndexPreviousPage):not(#todayAirQualityIndexNextPage)"
    )
  );
  pageLinks.forEach((link) => link.remove());

  // Page range setup
  const maxVisiblePages = 5;
  let startPage = Math.max(
    1,
    todayAirQualityIndexCurrentPage - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add page links
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item";
    if (i === todayAirQualityIndexCurrentPage) pageItem.classList.add("active");

    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.innerText = i;

    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      todayAirQualityIndexCurrentPage = i;
      todayDisplayAirQualityIndexTable(todayAirQualityIndexCurrentPage);
      todaySetupAirQualityIndexPagination();
    });

    pageItem.appendChild(pageLink);
    pagination.insertBefore(pageItem, nextPageElement);
  }

  // Enable/disable previous and next buttons
  document
    .getElementById("todayAirQualityIndexPreviousPage")
    .classList.toggle("disabled", todayAirQualityIndexCurrentPage === 1);
  document
    .getElementById("todayAirQualityIndexNextPage")
    .classList.toggle("disabled", todayAirQualityIndexCurrentPage === totalPages);

  // Previous button functionality
  document.getElementById("todayAirQualityIndexPreviousPage").onclick = (e) => {
    e.preventDefault();
    if (todayAirQualityIndexCurrentPage > 1) {
      todayAirQualityIndexCurrentPage--;
      todayDisplayAirQualityIndexTable(todayAirQualityIndexCurrentPage);
      todaySetupAirQualityIndexPagination();
    }
  };

  // Next button functionality
  document.getElementById("todayAirQualityIndexNextPage").onclick = (e) => {
    e.preventDefault();
    if (todayAirQualityIndexCurrentPage < totalPages) {
      todayAirQualityIndexCurrentPage++;
      todayDisplayAirQualityIndexTable(todayAirQualityIndexCurrentPage);
      todaySetupAirQualityIndexPagination();
    }
  };
}

// Initialize table and pagination
document.addEventListener("DOMContentLoaded", () => {
  fetch("/api/predict/today-aqi").then((response) =>
    response.json().then((response) => {
      todayAirQualityIndexData = response;
      todayDisplayAirQualityIndexTable(todayAirQualityIndexCurrentPage);
      todaySetupAirQualityIndexPagination();
    })
  );
});
