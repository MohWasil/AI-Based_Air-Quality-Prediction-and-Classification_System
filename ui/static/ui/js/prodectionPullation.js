// Simulated pollution data
const pollutantsMultiTrace = ['CO', 'NO2', 'SO2', 'PM2.5', 'PM10', 'O3'];

// Generate dates for 3 days with specific times (day: 6, 7, 8 AM; night: 5, 6, 7 PM)
const daysMultiTrace = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayTimes = [6, 7, 8]; // Day hours (AM)
    const nightTimes = [17, 18, 19]; // Night hours (PM)
    return [
        ...dayTimes.map((hour) => {
            const dayDate = new Date(date);
            dayDate.setHours(hour, 0, 0);
            return dayDate;
        }),
        ...nightTimes.map((hour) => {
            const nightDate = new Date(date);
            nightDate.setHours(hour, 0, 0);
            return nightDate;
        })
    ];
}).flat();

// Format dates and times for display
const formattedDays = daysMultiTrace.map((dateTime) =>
    dateTime.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    })
);

const pollutionDataMultiTrace = pollutantsMultiTrace.reduce((acc, pollutant) => {
    acc[pollutant] = {
        high: Array.from({ length: daysMultiTrace.length }, () => Math.random() * 150), // Random high values
        low: Array.from({ length: daysMultiTrace.length }, () => Math.random() * 100)  // Random low values
    };
    return acc;
}, {});

function createAnimatedGraph(pollutant) {
    const highValues = pollutionDataMultiTrace[pollutant].high;
    const lowValues = pollutionDataMultiTrace[pollutant].low;

    const frames = [];
    for (let i = 0; i < highValues.length; i++) {
        frames[i] = {
            data: [
                {
                    x: formattedDays.slice(0, i + 1),
                    y: lowValues.slice(0, i + 1)
                },
                {
                    x: formattedDays.slice(0, i + 1),
                    y: highValues.slice(0, i + 1)
                }
            ]
        };
    }

    const traceLow = {
        type: "scatter",
        mode: "lines",
        name: `${pollutant} Low`,
        x: [],
        y: [],
        line: { color: "green" },
        hovertemplate: `
            <b>Pollutant:</b> ${pollutant}<br>
            <b>Date & Time:</b> %{x}<br>
            <b>Concentration (Low):</b> %{y:.2f}<br>
            <extra></extra>`
    };

    const traceHigh = {
        type: "scatter",
        mode: "lines",
        name: `${pollutant} High`,
        fill: "tonexty",
        x: [],
        y: [],
        line: { color: "orange" },
        hovertemplate: `
            <b>Pollutant:</b> ${pollutant}<br>
            <b>Date & Time:</b> %{x}<br>
            <b>Concentration (High):</b> %{y:.2f}<br>
            <extra></extra>`
    };

    const layout = {
        title: `Pollution Level: ${pollutant}`,
        xaxis: {
            range: [formattedDays[0], formattedDays[formattedDays.length - 1]],
            title: {
                text: "Date & Time",
                standoff: 20 // Adds space between axis labels and title
            },
            tickangle: -45, // Rotates date labels for better visibility
            automargin: true, // Prevents labels from overlapping or getting cut off
            showgrid: false
        },
        yaxis: {
            range: [0, 200],
            title: "Pollutant Concentration",
            showgrid: true
        },
        updatemenus: [
            {
                x: 0.5,
                y: -0.15, // Positioning buttons below the chart
                yanchor: "top",
                xanchor: "center",
                showactive: false,
                direction: "left",
                type: "buttons",
                buttons: [
                    {
                        method: "animate",
                        args: [null, { frame: { duration: 500, redraw: false } }],
                        label: "Play"
                    },
                    {
                        method: "animate",
                        args: [null, { mode: "immediate", frame: { duration: 0, redraw: false } }],
                        label: "Pause"
                    }
                ]
            }
        ]
    };


    const data = [traceLow, traceHigh];
    Plotly.newPlot("multiTraceChart", data, layout).then(() => {
        Plotly.addFrames("multiTraceChart", frames);
    });

    // Update pollutant info
    document.getElementById("pollutantName").innerHTML = `Pollutant: <strong>${pollutant}</strong>`;
}

// Populate the dropdown with pollutant options
function populateDropdown() {
    const dropdown = document.getElementById("pollutantSelect");
    pollutantsMultiTrace.forEach((pollutant) => {
        const option = document.createElement("option");
        option.value = pollutant;
        option.textContent = pollutant;
        dropdown.appendChild(option);
    });
}

// Update the graph when a new pollutant is selected
function updateGraph() {
    const selectedPollutant = document.getElementById("pollutantSelect").value;
    createAnimatedGraph(selectedPollutant);
}

// Initialize the dropdown and the graph
populateDropdown();
createAnimatedGraph(pollutantsMultiTrace[0]);
