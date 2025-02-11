// Sample Data for Air Quality Index
const airQualityIndexData = [];
for (let i = 1; i <= 100; i++) {
    airQualityIndexData.push({
        id: i,
        country: `Country ${i % 10 + 1}`,
        state: `State ${i % 5 + 1}`,
        latitude: (Math.random() * 180 - 90).toFixed(4), // Random Latitude
        longitude: (Math.random() * 360 - 180).toFixed(4), // Random Longitude
        aqi: Math.floor(Math.random() * 500 + 1), // Random AQI
        co: (Math.random() * 10).toFixed(2),
        no: (Math.random() * 10).toFixed(2),
        no2: (Math.random() * 10).toFixed(2),
        o3: (Math.random() * 10).toFixed(2),
        so2: (Math.random() * 10).toFixed(2),
        pm25: (Math.random() * 50).toFixed(2), // PM2.5
        pm10: (Math.random() * 50).toFixed(2), // PM10
        nh3: (Math.random() * 10).toFixed(2),
        localTime: new Date().toLocaleString(),
    });
}

const airQualityIndexRowsPerPage = 10;
let airQualityIndexCurrentPage = 1;

function displayAirQualityIndexTable(page) {
    const startIndex = (page - 1) * airQualityIndexRowsPerPage;
    const endIndex = startIndex + airQualityIndexRowsPerPage;
    const tableBody = document.getElementById('airQualityIndexTableBody');

    tableBody.innerHTML = '';
    airQualityIndexData.slice(startIndex, endIndex).forEach(data => {
        const row = `<tr>
                        <td>${data.id}</td>
                        <td>${data.country}</td>
                        <td>${data.state}</td>
                        <td>${data.latitude}</td>
                        <td>${data.longitude}</td>
                        <td>${data.aqi}</td>
                        <td>${data.co}</td>
                        <td>${data.no}</td>
                        <td>${data.no2}</td>
                        <td>${data.o3}</td>
                        <td>${data.so2}</td>
                        <td>${data.pm25}</td>
                        <td>${data.pm10}</td>
                        <td>${data.nh3}</td>
                        <td>${data.localTime}</td>
                        <td><a class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#countryDetailsModal">Read More</a></td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

function setupAirQualityIndexPagination() {
    const totalPages = Math.ceil(airQualityIndexData.length / airQualityIndexRowsPerPage);
    const pagination = document.getElementById('airQualityIndexPagination');

    if (!pagination) {
        console.error("Pagination container not found.");
        return;
    }

    const nextPageElement = document.getElementById('airQualityIndexNextPage');
    if (!nextPageElement) {
        console.error("Element with id 'airQualityIndexNextPage' not found.");
        return;
    }

    // Clear old page links
    const pageLinks = Array.from(pagination.querySelectorAll('.page-item:not(#airQualityIndexPreviousPage):not(#airQualityIndexNextPage)'));
    pageLinks.forEach(link => link.remove());

    // Page range setup
    const maxVisiblePages = 5;
    let startPage = Math.max(1, airQualityIndexCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add page links
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        if (i === airQualityIndexCurrentPage) pageItem.classList.add('active');

        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.innerText = i;

        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            airQualityIndexCurrentPage = i;
            displayAirQualityIndexTable(airQualityIndexCurrentPage);
            setupAirQualityIndexPagination();
        });

        pageItem.appendChild(pageLink);
        pagination.insertBefore(pageItem, nextPageElement);
    }

    // Enable/disable previous and next buttons
    document.getElementById('airQualityIndexPreviousPage').classList.toggle('disabled', airQualityIndexCurrentPage === 1);
    document.getElementById('airQualityIndexNextPage').classList.toggle('disabled', airQualityIndexCurrentPage === totalPages);

    // Previous button functionality
    document.getElementById('airQualityIndexPreviousPage').onclick = (e) => {
        e.preventDefault();
        if (airQualityIndexCurrentPage > 1) {
            airQualityIndexCurrentPage--;
            displayAirQualityIndexTable(airQualityIndexCurrentPage);
            setupAirQualityIndexPagination();
        }
    };

    // Next button functionality
    document.getElementById('airQualityIndexNextPage').onclick = (e) => {
        e.preventDefault();
        if (airQualityIndexCurrentPage < totalPages) {
            airQualityIndexCurrentPage++;
            displayAirQualityIndexTable(airQualityIndexCurrentPage);
            setupAirQualityIndexPagination();
        }
    };
}

// Initialize table and pagination
document.addEventListener('DOMContentLoaded', () => {
    displayAirQualityIndexTable(airQualityIndexCurrentPage);
    setupAirQualityIndexPagination();
});
