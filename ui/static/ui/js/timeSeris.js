// Function to fetch and process pollution data
async function fetchAndProcessPollutionData() {
    try {
        const responselocation = await fetch("https://ipinfo.io/json?token=83749eeb0af037");
        const data = await responselocation.json();
        const { country, city, loc } = data;
        const [latitude, longitude] = loc.split(",");
        const response = await fetch(`/api/predict/predict/?country=${country}&state=${city}&latitude=${latitude}&longitude=${longitude}`);
        const apiData = await response.json();
        if (!apiData) return null;


        // Extract pollution levels with rounding and scaling
        const pollutants = apiData.feature_importance.map(([name, value]) => ({
            name: name.toUpperCase(),
            value: Math.round(value * 100) // Round and scale value
        }));

        //GPT Advices for users organization anf individuals
        const gtptext = apiData.GPT_Advice;
        document.getElementById("gptTextAdvice").innerHTML = gtptext;

       

        // Desired pollutant keys
            const selectedKeys = ["PM2_5", "PM10", "CO", "SO2"];
            // Filter the 'pollutants' array so that only the desired pollutants remain
            const selectedPollutants = pollutants.filter(pollutant => selectedKeys.includes(pollutant.name));

            // For each selected pollutant, display its value in the HTML element with the corresponding id
            selectedPollutants.forEach(pollutant => {
                const element = document.getElementById(pollutant.name);
                if (element) {
                    let unit = "";
            
                    // Assign unit based on pollutant type
                    if (pollutant.name === "PM2_5" || pollutant.name === "PM10") {
                        unit = " μg/m³";  // Micrograms per cubic meter
                    } else if (pollutant.name === "CO" || pollutant.name === "SO2") {
                        unit = " ppb";  // Parts per billion
                    }
            
                    // Set the innerHTML with value and unit
                    element.innerHTML = `<strong>${pollutant.value}%</strong>${unit}`;
                }
            });
            // Extract hourly forecast data from API response
            const hourlyTimeStatus = apiData.predic_res.map(([time, status]) => ({
                time,
                status
            }));
            //================================================================
            // Check if the required data exists
                if (apiData.predic_res && apiData.predic_res.length > 0 && apiData.feature_importance) {
                    // Find the pollutant with the highest value
                    const highestPollutant = apiData.feature_importance
                        .map(([name, value]) => ({ name: name.toUpperCase(), value: Math.round(value * 100) }))
                        .reduce((max, pollutant) => (pollutant.value > max.value ? pollutant : max), { value: -Infinity });

                    // Extract the last 6 forecast values (up to 72 hours)
                    const timeFrames = ["1H", "3H", "6H", "24H", "48H", "72H"];
                    const hourlyTimeStatus = timeFrames.map(time => {
                        const found = apiData.predic_res.find(([t]) => t === time);
                        return found ? found[1] : "Unknown"; // If not found, display "Unknown"
                    });

                    // Get the table elements
                    const forecastTable = document.querySelector(".table thead");
                    const forecastBody = document.querySelector(".table tbody");

                    if (forecastTable && forecastBody) {
                        // Set up the table header
                        forecastTable.innerHTML = `
                            <tr>
                                <th>Pollutant</th>
                                ${timeFrames.map(time => `<th>${time}</th>`).join("")}
                            </tr>
                        `;

                        // Create a row for pollutant values at each time frame
                        let pollutantRow = `<tr><td><span class="fw-bold">${highestPollutant.name}</span></td>`;
                        timeFrames.forEach(() => {
                            pollutantRow += `<td><span class="text-danger fw-bold">${highestPollutant.value} µg/m³</span></td>`;
                        });
                        pollutantRow += "</tr>";

                        // Create a row for air quality status at each time frame
                        let statusRow = "<tr><td>Status</td>";
                        hourlyTimeStatus.forEach(status => {
                            statusRow += `<td><span class="badge bg-danger">${status}</span></td>`;
                        });
                        statusRow += "</tr>";

                        // Replace table content with the generated rows
                        forecastBody.innerHTML = pollutantRow + statusRow;
                    }
                }
            //================================================================
            //daily forecast
            if (apiData.predic_res && apiData.predic_res.length > 0 && apiData.feature_importance) {
                // Extract the hourly time status from API (time and status)
                const hourlyTimeStatus = apiData.predic_res.map(([time, status]) => ({ time, status }));
            
                // Extract pollutant levels from API and round/scale the values
                const pollutants = apiData.feature_importance.map(([name, value]) => ({
                    name: name.toUpperCase(),
                    value: Math.round(value * 100) // Multiply by 100 and round the value
                }));
            
                // Sort pollutants by value descending and take the top three pollutants
                const sortedPollutants = pollutants.sort((a, b) => b.value - a.value);
                const topPollutants = sortedPollutants.slice(0, 3);
            
                // Create a string for pollutant names without individual span wrappers
                const pollutantNamesStr = topPollutants.map(p => p.name).join(", ");
                const pollutantPercentagesStr = topPollutants.map(p => p.value + "%").join(", ");
            
                // Determine the background class based on the highest percentage value among the top pollutants
                let pollutantBgClass = "";
                if (topPollutants.length > 0) {
                    const highestValue = topPollutants[0].value;
                    if (highestValue >= 50) {
                        pollutantBgClass = "bg-danger text-white";
                    } else if (highestValue >= 30) {
                        pollutantBgClass = "bg-warning";
                    } else {
                        pollutantBgClass = "bg-success text-white";
                    }
                }
            
                // Define time groupings for daily forecast
                // Group 1: Today → includes 1H, 3H, and 6H
                const group1Times = ["1H", "3H", "6H"];
                const group1HoursStr = group1Times.join(", ");
                // Get the status for group 1 (using the first matching time)
                const group1Entry = apiData.predic_res.find(([time]) => group1Times.includes(time));
                const group1Status = group1Entry ? group1Entry[1] : "Unknown";
            
                // Group 2: Next 24 Hour → uses 24H
                const group2Time = "24H";
                const group2Entry = apiData.predic_res.find(([time]) => time === group2Time);
                const group2Status = group2Entry ? group2Entry[1] : "Unknown";
            
                // Group 3: Next 48, 72H → includes 48H and 72H
                const group3Times = ["48H", "72H"];
                const group3HoursStr = group3Times.join(", ");
                const group3Entry = apiData.predic_res.find(([time]) => group3Times.includes(time));
                const group3Status = group3Entry ? group3Entry[1] : "Unknown";
            
                // Build the table rows for the daily forecast table.
                // The table columns are: Day, Pollution Name, Percentage, State, and Hour.
                // The "Day" cell text is bolded.
                const rowToday = `
                    <tr>
                        <td><strong>Today</strong></td>
                        <td class="text-center ${pollutantBgClass}">${pollutantNamesStr}</td>
                        <td>${pollutantPercentagesStr}</td>
                        <td>${group1Status}</td>
                        <td>${group1HoursStr}</td>
                    </tr>
                `;
                const rowNext24 = `
                    <tr>
                        <td><strong>Next 24 Hour</strong></td>
                        <td class="text-center ${pollutantBgClass}">${pollutantNamesStr}</td>
                        <td>${pollutantPercentagesStr}</td>
                        <td>${group2Status}</td>
                        <td>${group2Time}</td>
                    </tr>
                `;
                const rowNext48_72 = `
                    <tr>
                        <td><strong>Next 48, 72H</strong></td>
                        <td class="text-center ${pollutantBgClass}">${pollutantNamesStr}</td>
                        <td>${pollutantPercentagesStr}</td>
                        <td>${group3Status}</td>
                        <td>${group3HoursStr}</td>
                    </tr>
                `;
            
                // Get the table body element by its ID and insert the generated rows
                const dailyTableBody = document.querySelector("#TableDayPullition tbody");
                if (dailyTableBody) {
                    dailyTableBody.innerHTML = rowToday + rowNext24 + rowNext48_72;
                }
            
                // Reduce the font size of the table
                const dailyTable = document.getElementById("TableDayPullition");
                if (dailyTable) {
                    dailyTable.style.fontSize = "0.85rem";
                }
            }
            //================================================================
                        // the must bad pollition in you city today
            // Check if feature_importance exists in the API data
                if (apiData.feature_importance && apiData.feature_importance.length > 0) {
                    // Map the API data to an array of objects with uppercase name and scaled (×100) & rounded value
                    const highestPollutant = apiData.feature_importance
                        .map(([name, value]) => ({
                            name: name.toUpperCase(),
                            value: Math.round(value * 100) // Multiply by 100 and round the value
                        }))
                        // Reduce to find the pollutant with the highest value
                        .reduce((max, pollutant) => (pollutant.value > max.value ? pollutant : max), { value: -Infinity });

                    // Store the highest pollutant's name and value in separate variables
                    const mustPullitionName = highestPollutant.name;
                    const pullitonValue = highestPollutant.value;
                    const pollutantDescriptor = highestPollutant.name;
                    const pullitonValueDescriptor = highestPollutant.value;
                    const pollutantSecondDescriptorName = highestPollutant.name;
                    
                    // Update the front-end elements with the stored values
                    const nameElement = document.getElementById("mustPullitionName");
                    const valueElement = document.getElementById("pullitonValue");
                    const descriptorPullutinName = document.getElementById("pullitonNameDescriptor");
                    const pullitonValueDescrition = document.getElementById("pullitonValueDescriptor");
                    const descriptorPullitonSecondName = document.getElementById("pollutantDescriptorSecondName");
                    
                    if (nameElement) {
                        nameElement.innerHTML = mustPullitionName;
                        descriptorPullutinName.innerHTML = pollutantDescriptor;
                    }
                    if (valueElement) {
                        valueElement.innerHTML = pullitonValue + "% µg/m³"; // Display the value with a percentage sign
                        pullitonValueDescrition.innerHTML = pullitonValueDescriptor + "% µg/m³"; // Display the value with a percentage sign
                        descriptorPullitonSecondName.innerHTML = pollutantSecondDescriptorName;
                    }
                }

            //================================================================
        // Extract prediction results from API
        const timeStatus = apiData.predic_res.map(([time, status]) => ({
            time,
            status
        }));

        return { timeStatus, pollutants };
    } catch (error) {
        console.error('Error fetching pollution data:', error);
        return null;
    }
}

// Define specific colors for each pollutant
const pollutantColors = {
    PM10: "#4e332e",
    PM2_5: "#9467bd",
    SO2: "#863536",
    O3: "#3f8f3f",
    NO2: "#ffa556",
    CO: "#3e759a"
};

// Function to generate the 3D pollution chart with multiple controls
function generate3DChart(timeStatus, pollutants, chartType = "surface", colorScale = "Jet") {
    const hours = timeStatus.map(item => item.time);
    const pollutantNames = pollutants.map(pollutant => pollutant.name);
    const zValues = pollutants.map(pollutant =>
        hours.map(() => pollutant.value)
    );

    const trace = {
        type: chartType,
        x: hours,
        y: pollutantNames,
        z: zValues,
        colorscale: colorScale,
        colorbar: { title: 'Pollution Level (%)' },
        hovertemplate: 'Time: %{x}<br>Pollutant: %{y}<br>Level: %{z}%<extra></extra>',
        surfaceaxis: 2
    };

    const layout = {
        title: "3D Pollution Visualization",
        font: { family: "Arial, sans-serif", size: 14 },
        scene: {
            xaxis: { title: "Time", tickangle: -30, gridcolor: 'lightgrey' },
            yaxis: { title: "Pollutants", gridcolor: 'lightgrey' },
            zaxis: { title: "Concentration (%)", range: [0, 100] },
            camera: { 
                eye: { x: 1.25, y: 1.25, z: 1.25 }, // Similar to Mt Bruno's top-down view with some perspective
                up: { x: 0, y: 0, z: 1 }, // Ensure the view remains upright
                center: { x: 0.5, y: 0.5, z: 0.5 }, // Focus the center of the plot
            },
            projection: {
                type: "orthographic" // Use orthographic projection for a "flat" map look
            },
        },
        
        margin: { l: 50, r: 50, b: 50, t: 50 },
        paper_bgcolor: "#f8f9fa",
        plot_bgcolor: "#ffffff",
        updatemenus: [
            {
                buttons: [
                    { label: 'Surface', method: 'restyle', args: ['type', 'surface'] },
                    { label: 'Heatmap', method: 'restyle', args: ['type', 'heatmap'] },
                    { label: 'Contour', method: 'restyle', args: ['type', 'contour'] },
                    { label: 'Mountain', method: 'restyle', args: ['type', 'surface', 'contours', { z: { show: true, highlight: false } }] }
                ],
                direction: 'down',
                showactive: true,
                x: 0.1,
                xanchor: 'left',
                y: 1.1,
                yanchor: 'top'
            },
            {
                buttons: [
                    { label: 'Jet', method: 'restyle', args: ['colorscale', 'Jet'] },
                    { label: 'Viridis', method: 'restyle', args: ['colorscale', 'Viridis'] },
                    { label: 'Cividis', method: 'restyle', args: ['colorscale', 'Cividis'] },
                    { label: 'YlGnBu', method: 'restyle', args: ['colorscale', 'YlGnBu'] },
                    { label: 'Inferno', method: 'restyle', args: ['colorscale', 'Inferno'] },
                    { label: 'Plasma', method: 'restyle', args: ['colorscale', 'Plasma'] },
                    { label: 'Magma', method: 'restyle', args: ['colorscale', 'Magma'] },
                    { label: 'RdBu', method: 'restyle', args: ['colorscale', 'RdBu'] },
                    { label: 'Jet (reverse)', method: 'restyle', args: ['colorscale', 'Jet_r'] },
                ],
                direction: 'down',
                showactive: true,
                x: 0.3,
                xanchor: 'left',
                y: 1.1,
                yanchor: 'top'
            }
        ]
    };

    Plotly.newPlot('timeSerise', [trace], layout);
}

// Function to generate the dynamic pollution trend graph with ranks and additional controls
function generatePollutionChart(timeStatus, pollutants) {
    const pollutionData = pollutants.map((pollutant, index) => {
        const lineWidth = 3;

        // Assign rank to each pollutant (this could be based on their importance or other factors)
        const rank = index + 1; // Simple rank based on the order
        const yValues = timeStatus.map(() => pollutant.value * Math.random() * 0.8 + 0.6 * pollutant.value);
        const xValues = timeStatus.map(item => item.time);
        const statusValues = timeStatus.map(item => item.status);

        // Get the corresponding color for the pollutant
        const pollutantColor = pollutantColors[pollutant.name] || "#000000"; // Default to black if no match

        return {
            name: pollutant.name,
            x: xValues,
            y: yValues,
            type: 'scatter',
            mode: 'markers+lines',
            marker: {
                size: yValues.map(value => Math.max(8, value / 1.5)), // Increased size for better visibility
                opacity: 1.5,
                symbol: 'circle',
                color: Array(yValues.length).fill(pollutantColor), // Color circles with the pollutant color
                line: {
                    width: 2,
                    color: pollutantColor
                }
            },
            line: {
                shape: 'spline', // Smooth curve
                width: lineWidth,
                color: pollutantColor
            },
            text: yValues.map((value, index) =>
                `Rank: ${rank}<br>Pollutant: ${pollutant.name}<br>Time: ${xValues[index]}<br>Status: ${statusValues[index]}`
            ),
            hoverinfo: 'text',
        };
    });

    const layout = {
        title: "Pollution Forecast",
        xaxis: { title: "Time" },
        yaxis: { title: "Pollution Level", range: [0, Math.max(...pollutants.map(p => p.value)) + 50] },
        hovermode: 'closest',
        paper_bgcolor: "#eef2f3",
        plot_bgcolor: "#ffffff",
        updatemenus: [
            {
                buttons: [
                    { label: 'Line', method: 'restyle', args: ['type', 'scatter'] },
                    { label: 'Bar', method: 'restyle', args: ['type', 'bar'] },
                    { label: 'Area', method: 'restyle', args: ['type', 'scatter', 'fill', 'tozeroy'] },
                ],
                direction: 'down',
                showactive: true,
                x: 0.5,
                xanchor: 'left',
                y: 1.1,
                yanchor: 'top'
            },
            {
                buttons: [
                    { label: 'Jet', method: 'restyle', args: ['colorscale', 'Jet'] },
                    { label: 'Viridis', method: 'restyle', args: ['colorscale', 'Viridis'] },
                    { label: 'Cividis', method: 'restyle', args: ['colorscale', 'Cividis'] },
                    { label: 'YlGnBu', method: 'restyle', args: ['colorscale', 'YlGnBu'] },
                ],
                direction: 'down',
                showactive: true,
                x: 0.5,
                xanchor: 'left',
                y: 1.1,
                yanchor: 'top'
            }
        ]
    };

    Plotly.newPlot('plotlyGraph', pollutionData, layout);
}

// Main function to fetch data and render both charts
async function generateCharts() {
    const apiData = await fetchAndProcessPollutionData();
    if (!apiData) return;

    const { timeStatus, pollutants } = apiData;

    generate3DChart(timeStatus, pollutants);
    generatePollutionChart(timeStatus, pollutants);
}

// Execute charts when the page is loaded
document.addEventListener("DOMContentLoaded", generateCharts);


// Function to generate the pollution data table
function generatePollutionTable(timeStatus, pollutants) {
    const table = document.getElementById('pollutionTableBody');
    table.innerHTML = ''; // Clear existing table rows

    let rowNumber = 1; // Initialize row number

    timeStatus.forEach((timeData) => {
        pollutants.forEach((pollutant) => {
            const row = document.createElement('tr');

            // Row Number Cell
            const numberCell = document.createElement('td');
            numberCell.textContent = rowNumber++; // Increment row number for each new row
            row.appendChild(numberCell);

            // Time Cell
            const timeCell = document.createElement('td');
            timeCell.textContent = timeData.time;
            row.appendChild(timeCell);

            // Status Cell
            const statusCell = document.createElement('td');
            statusCell.textContent = timeData.status || 'N/A'; // Display 'N/A' if no status is found
            row.appendChild(statusCell);

            // Pollutant Cell
            const pollutantCell = document.createElement('td');
            pollutantCell.textContent = pollutant.name;
            row.appendChild(pollutantCell);

            // Value Cell
            const valueCell = document.createElement('td');
            const valueInPercent = (pollutant.value); // Convert value to percentage with two decimal places
            valueCell.textContent = `${valueInPercent}%`; // Add '%' symbol
            row.appendChild(valueCell);

            table.appendChild(row);
        });
    });
}

// Main function to fetch data and render both charts and table
async function generateChartsAndTable() {
    const apiData = await fetchAndProcessPollutionData();
    if (!apiData) return;

    const { timeStatus, pollutants } = apiData;

    // Generate the 3D chart and pollution chart
    generate3DChart(timeStatus, pollutants);
    generatePollutionChart(timeStatus, pollutants);

    // Generate the pollution data table
    generatePollutionTable(timeStatus, pollutants);
}

// Execute charts and table when the page is loaded
document.addEventListener("DOMContentLoaded", generateChartsAndTable);


// new graph
// Function to generate an alternative pollution chart with a unique style
function generateAlternativePollutionChart(timeStatus, pollutants) {
    // Prepare data for the alternative chart
    const pollutionData = pollutants.map((pollutant, index) => {
        const yValues = timeStatus.map(() => pollutant.value * Math.random() * 0.8 + 0.6 * pollutant.value);
        const xValues = timeStatus.map(item => item.time);
        const statusValues = timeStatus.map(item => item.status);

        // Get the corresponding color for the pollutant
        const pollutantColor = pollutantColors[pollutant.name] || "#000000"; // Default to black if no match

        return {
            name: pollutant.name,
            x: xValues,
            y: yValues,
            type: 'bar', // Using a bar chart instead of line
            marker: {
                color: pollutantColor,
                opacity: 0.7,
                line: {
                    width: 1.5,
                    color: "#222222" // Add a dark outline for better visibility
                }
            },
            text: yValues.map((value, index) =>
                `Pollutant: ${pollutant.name}<br>Time: ${xValues[index]}<br>Status: ${statusValues[index]}`
            ),
            hoverinfo: 'text',
        };
    });

    const layout = {
        title: "Alternative Pollution Visualization",
        xaxis: { title: "Time" },
        yaxis: { title: "Pollution Level", range: [0, Math.max(...pollutants.map(p => p.value)) + 50] },
        barmode: 'stack', // Stacked bar chart style
        paper_bgcolor: "#f0f0f0", // Light gray background for better contrast
        plot_bgcolor: "#ffffff",
        hovermode: 'closest',
    };

    Plotly.newPlot('multiTraceChart', pollutionData, layout);
}
