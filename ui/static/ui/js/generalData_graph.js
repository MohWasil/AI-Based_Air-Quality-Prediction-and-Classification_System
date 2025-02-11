// Function to fetch pollution data from the API
async function fetchPollutionData() {
    try {
        const response = await fetch("https://ipinfo.io/json?token=83749eeb0af037");
        const data = await response.json();
        const { country, city, loc } = data;
        const [latitude, longitude] = loc.split(",");
        
        const airDataResponse = await fetch(`/api/predict/predict/?country=${country}&state=${city}&latitude=${latitude}&longitude=${longitude}`);
        const airData = await airDataResponse.json();
        
        return airData;
    } catch (error) {
        console.error("Error fetching location or pollution data:", error);
        return null;
    }
}

// Function to categorize pollution levels
function categorizePollutionLevel(value) {
    if (value > 300) return `Dangerous (${value})`;
    if (value > 200) return `Abnormal (${value})`;
    if (value > 100) return `Moderate (${value})`;
    return `Good (${value})`;
}

// Function to generate the chart and table
async function generateChartAndTable() {
    const apiData = await fetchPollutionData();
    if (!apiData) return;
    
    const featureImportance = apiData.feature_importance.map(([name, value]) => ({
        pollutant: name.toUpperCase(),
        importance: Math.round(value * 100)
    }));
    
    const predictionResults = apiData.predic_res.map(([time, status]) => ({
        time,
        status
    }));
    
    // Generate Chart Data
    const pollutionData = featureImportance.map(({ pollutant }) => {
        const pollutantData = predictionResults.map(({ time, status }) => ({
            time,
            value: Math.random() * 100,
            status
        }));
        
        return {
            name: pollutant,
            x: pollutantData.map(item => item.time),
            y: pollutantData.map(item => item.value),
            type: 'scatter',
            mode: 'markers+lines',
            marker: { size: pollutantData.map(item => item.value / 2), opacity: 0.7, symbol: 'circle' },
            line: { shape: 'spline', width: 3 },
            text: pollutantData.map(({ time, status }) => `Pollutant: ${pollutant}<br>Time: ${time}<br>Status: ${status}`),
            hoverinfo: 'text'
        };
    });
    
    // Plot the chart
    Plotly.newPlot('plotlyChartData', pollutionData, { title: "Pollution Forecast", xaxis: { title: "Time" }, yaxis: { title: "Pollution Level" }, hovermode: 'closest' });
    
    // Generate Table
    const tableContainer = document.getElementById('pollutionTable');
    tableContainer.innerHTML = '';
    const table = document.createElement('table');
    table.className = "table table-bordered table-hover table-striped text-center";
    
    // Table Header
    table.innerHTML = `<thead class="table-primary"><tr>
        <th>No</th>
        <th>Pollutant</th>
        <th>Time</th>
        <th>Status</th>
        <th>Feature Importance</th>
    </tr></thead>`;
    
    // Table Body
    const tbody = document.createElement('tbody');
    let index = 1;
    featureImportance.forEach(({ pollutant, importance }) => {
        predictionResults.forEach(({ time, status }) => {
            const row = `<tr>
                <td>${index++}</td>
                <td>${pollutant}</td>
                <td>${time}</td>
                <td>${status}</td>
                <td>${importance}%</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    });
    
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

document.addEventListener("DOMContentLoaded", generateChartAndTable);
