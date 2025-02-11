// Function to fetch pollution data from the API
async function dataTableFetchPollutionData() {
    try {
        // Fetching the data from the API
        const response = await fetch('/api/predict/predict/');
        if (!response.ok) throw new Error('Failed to fetch data'); // Error if the response is not okay
        return await response.json(); // Return the data as JSON
    } catch (error) {
        console.error('Error fetching pollution data:', error); // Log error if something goes wrong
        return null; // Return null in case of an error
    }
}

// Function to categorize the pollution level based on the value (Dangerous, Abnormal, Moderate, or Good)
function dataTableCategorizePollutionLevel(value) {
    if (value === "Dangerous") return "Dangerous";
    if (value === "Abnormal") return "Abnormal";
    if (value === "Moderate") return "Moderate";
    return "Good"; // If none of the above, return "Good"
}

// Function to generate a random color for each pollutant
function dataTableGetRandomColor() {
    const colors = ["#FFEFEF", "#EFFFF3", "#F0F0FF", "#FFF7E6", "#E6F7FF"]; // Array of soft colors
    return colors[Math.floor(Math.random() * colors.length)]; // Randomly select a color from the array
}

// Function to generate the chart (in this case, creating and populating the table)
async function dataTableGenerateChart() {
    const dataTableApiData = await dataTableFetchPollutionData(); // Fetch pollution data
    
    // If no data is returned or the API response doesn't contain required data, exit
    if (!dataTableApiData || !dataTableApiData.feature_importance || !dataTableApiData.predic_res) {
        console.error("Invalid or empty API response");
        return;
    }

    // Map feature importance data for easier access later
    const dataTableFeatureImportance = dataTableApiData.feature_importance.map(([name, value]) => ({
        pollutant: name.toUpperCase(), // Uppercase the pollutant name
        importance: Math.round(value * 100) // Round the importance value and multiply by 100
    }));

    // Map prediction results with time and categorized status
    const dataTablePredictionResults = dataTableApiData.predic_res.map(([time, status]) => ({
        time: time, // Time of the prediction
        status: dataTableCategorizePollutionLevel(status) // Categorized pollution level (Dangerous, Abnormal, etc.)
    }));

    const tableContainer = document.getElementById('pollutionTable'); // Get the table container in the HTML
    if (!tableContainer) {
        console.error("pollutionTable not found in the document");
        return; // Exit if the container is not found
    }

    // Clear the existing content in the table container
    tableContainer.innerHTML = '';

    // Create a wrapper for the table
    const tableWrapper = document.createElement('div');
    tableWrapper.className = "table-responsive"; // Add class for responsiveness

    // Create the table
    const table = document.createElement('table');
    table.className = "table table-bordered table-hover table-striped text-center"; // Add classes for styling

    // Create the header row
    const thead = document.createElement('thead');
    thead.className = "table-primary"; // Add class for header styling
    const headerRow = document.createElement('tr');
    ["No", "Pollutant", "Time", "Status", "Feature Importance"].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text; // Set the text of the header cell
        th.className = "border"; // Add border style
        headerRow.appendChild(th); // Append header cell to the row
    });
    thead.appendChild(headerRow); // Append the header row to the header

    // Create the body of the table
    const tbody = document.createElement('tbody');

    let index = 1;
    let firstPollutant = true; // Variable to check if it's the first pollutant

    // Loop through the feature importance data and create rows
    dataTableFeatureImportance.forEach(({ pollutant, importance }) => {
        const rowColor = dataTableGetRandomColor(); // Get a random color for each pollutant

        // Add a separator row between different pollutants
        if (!firstPollutant) {
            const separatorRow = document.createElement('tr');
            separatorRow.innerHTML = `<td colspan="5" class="border" style="height: 2px; background-color: #538221;"></td>`;
            tbody.appendChild(separatorRow);
        }
        firstPollutant = false; // After the first pollutant, set this to false

        // Loop through the prediction results and create rows for each time/status
        dataTablePredictionResults.forEach(({ time, status }) => {
            const row = document.createElement('tr');
            row.style.backgroundColor = rowColor; // Set the background color of the row

            // Create the cells for each row (No, Pollutant, Time, Status, Feature Importance)
            const noCell = document.createElement('td');
            noCell.textContent = index++; // Increment and display the index
            noCell.className = "border"; // Add border style
            row.appendChild(noCell);

            const pollutantCell = document.createElement('td');
            pollutantCell.textContent = pollutant; // Display the pollutant name
            pollutantCell.className = "border fw-bold"; // Add bold style
            row.appendChild(pollutantCell);

            const timeCell = document.createElement('td');
            timeCell.textContent = time; // Display the time
            timeCell.className = "border small text-muted"; // Style the time cell
            row.appendChild(timeCell);

            const statusCell = document.createElement('td');
            statusCell.textContent = status; // Display the status (e.g., Dangerous)
            statusCell.className = "border"; // Add border style
            row.appendChild(statusCell);

            const importanceCell = document.createElement('td');
            importanceCell.textContent = importance + '%'; // Display the importance of the pollutant with % symbol
            importanceCell.className = "border fw-bold"; // Add bold style
            row.appendChild(importanceCell);

            tbody.appendChild(row); // Add the row to the table body
        });
    });

    // Append the header and body to the table
    table.appendChild(thead);
    table.appendChild(tbody);
    tableWrapper.appendChild(table); // Add the table to the wrapper
    tableContainer.appendChild(tableWrapper); // Add the wrapper to the table container
}

// Wait for the document to load before running the chart generation function
document.addEventListener("DOMContentLoaded", dataTableGenerateChart);
