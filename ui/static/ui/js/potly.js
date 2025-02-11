// Get today's date and calculate the hours for three days
function getHoursForThreeDays() {
    const today = new Date(); // January 4, 2025
    const weekDays = [];
    const hoursDay = ["06:00", "07:00", "08:00"]; // Morning hours
    const hoursNight = ["17:00", "18:00", "19:00"]; // Evening hours
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (let i = 0; i < 3; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const formattedDate = date.toISOString().split('T')[0];
        const dayName = dayNames[date.getDay()];

        // Combine morning and evening hours (excluding 12:00)
        const hours = [...hoursDay, ...hoursNight];
        hours.forEach((hour) => {
            weekDays.push({
                date: formattedDate,
                time: hour,
                fullDateTime: `${formattedDate} ${hour}`,
                day: dayName,
            });
        });
    }
    return weekDays;
}

// Generate hours dynamically for the x-axis or replace it with dataset dates if available
const hoursData = getHoursForThreeDays();
const startingValue = 50; // Base value for all lines

// Sample pollutants data
const pollutants = ["PM2.5", "CO2", "NO2", "SO2", "O3", "PM10"];

const pollutionData = pollutants.map((pollutant) => {
    // Generate random pollution values for each hour (replace this section with dataset values)
    const values = Array.from({ length: hoursData.length }, () => Math.floor(Math.random() * 300) + 50);

    const yValues = [startingValue, ...values]; // Starting value added to y-values
    const xValues = ["Start", ...hoursData.map((item) => item.fullDateTime)]; // Full date and time for x-axis

    return {
        name: pollutant, // Name of the pollutant
        x: xValues, // Dates and times for the x-axis
        y: yValues, // Pollution levels for the y-axis
        type: 'scatter',
        mode: 'markers+lines', // Add lines to connect points
        marker: {
            size: values.map((value) => value / 5), // Marker size proportional to value
            opacity: 0.7,
            symbol: 'circle', // Circular markers
        },
        line: {
            shape: 'spline', // Smooth line connection
            width: 2, // Line thickness
        },
        text: yValues.map((value, index) => {
            const timeInfo = index > 0 ? hoursData[index - 1] : { date: "Start", time: "", day: "" };
            return `Pollutant: ${pollutant}<br>Date: ${timeInfo.date}<br>Time: ${timeInfo.time}<br>Day: ${timeInfo.day}<br>Value: ${value} μg/m³`;
        }),
        hoverinfo: 'text', // Display hover information
    };
});

// Frames for animation
const frames = hoursData.map((hour, index) => {
    return {
        name: hour.fullDateTime,
        data: pollutionData.map((pollutant) => {
            return {
                x: pollutant.x.slice(0, index + 2), // Include points up to the current hour
                y: pollutant.y.slice(0, index + 2),
                type: 'scatter',
                mode: 'markers+lines',
                name: pollutant.name,
                marker: {
                    size: pollutant.y.slice(1, index + 2).map((value) => value / 5),
                    opacity: 0.7,
                    symbol: 'circle',
                },
                line: {
                    shape: 'spline',
                    width: 2,
                },
            };
        }),
    };
});

// Slider steps for controlling animation
const sliderSteps = hoursData.map((hour) => {
    return {
        method: 'animate',
        label: `${hour.date} ${hour.time}`, // Display date and time on slider
        args: [
            [hour.fullDateTime],
            {
                mode: 'immediate',
                transition: { duration: 600 }, // Transition duration
                frame: { duration: 600, redraw: false }, // Frame duration
            },
        ],
    };
});

// Customizing the x-axis for the layout with date in the middle and times around it
const formatXAxisLabels = (hoursData) => {
    const labels = [];
    for (let i = 0; i < hoursData.length; i += 3) {
        const dayData = hoursData.slice(i, i + 3);
        const times = dayData.map(item => item.time).join(', ');
        const date = dayData[0].date;
        labels.push(`${times} ${date}`);
    }
    return labels;
};

// Graph layout settings
const layout = {
    title: 'Air Pollution Levels Over Three Days and Selected Hours', // Graph title
    xaxis: {
        title: 'Date and Time', // X-axis label
        tickvals: formatXAxisLabels(hoursData), // Set custom x-axis labels
    },
    yaxis: { title: 'Pollution Level (μg/m³)' }, // Y-axis label
    showlegend: true, // Display legend for pollutants
    hovermode: 'closest', // Show hover info for nearest data point
    dragmode: 'zoom', // Enable zooming
    updatemenus: [
        {
            x: 0, // Position of play/pause buttons
            y: 0,
            yanchor: 'top',
            xanchor: 'left',
            showactive: false,
            direction: 'left',
            type: 'buttons',
            pad: { t: 87, r: 10 },
            buttons: [
                {
                    method: 'animate',
                    args: [
                        null,
                        {
                            mode: 'immediate',
                            fromcurrent: true,
                            transition: { duration: 600 },
                            frame: { duration: 600, redraw: false },
                        },
                    ],
                    label: 'Play', // Play animation
                },
                {
                    method: 'animate',
                    args: [
                        [null],
                        {
                            mode: 'immediate',
                            transition: { duration: 0 },
                            frame: { duration: 0, redraw: false },
                        },
                    ],
                    label: 'Pause', // Pause animation
                },
            ],
        },
    ],
    sliders: [
        {
            pad: { l: 130, t: 55 },
            currentvalue: {
                visible: true,
                prefix: 'Time: ',
                xanchor: 'right',
                font: { size: 20, color: '#666' },
            },
            steps: sliderSteps, // Slider steps for animation
        },
    ],
};

// Render graph
Plotly.newPlot('plotlyChartData', {
    data: pollutionData, // Pollution data for plotting
    layout: layout, // Graph layout
    frames: frames, // Animation frames
});

//======================================================================>
//Barchart
// Function to generate short dates for three days
function generateShortDates(startDate, days) {
    const dates = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < days; i++) {
        let date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const day = date.getDate();
        const month = monthNames[date.getMonth()].slice(0, 3);
        dates.push(`${month} ${day}`);
    }
    return dates;
}

// Generate specific hours for morning and evening
function generateSpecificHours(dates) {
    const specificHours = [];
    const morningHours = ["06:00", "07:00", "08:00"];
    const eveningHours = ["17:00", "18:00", "19:00"];

    dates.forEach(date => {
        morningHours.forEach(hour => {
            specificHours.push(`${date} ${hour}`);
        });
        eveningHours.forEach(hour => {
            specificHours.push(`${date} ${hour}`);
        });
    });

    return specificHours;
}

// Generate hourly data based on specific hours
function generateHourlyData(specificHours) {
    const hourlyData = [];
    specificHours.forEach(datetime => {
        hourlyData.push({
            datetime: datetime,
            pm25: Math.random() * 50,  // Example PM2.5 value
            co2: Math.random() * 400,  // Example CO2 value
            no2: Math.random() * 200,  // Example NO2 value
            so2: Math.random() * 100,  // Example SO2 value
            o3: Math.random() * 150,   // Example O3 value
            pm10: Math.random() * 80,  // Example PM10 value
            limit: 100  // Example limit for all pollutants
        });
    });
    return hourlyData;
}

// Get today's date
const startDate = new Date();
const days = 3;  // Only three days

// Generate short dates and specific hours
const dates = generateShortDates(startDate, days);
const specificHours = generateSpecificHours(dates);

// Generate hourly data for the specific hours
const hourlyData = generateHourlyData(specificHours);

// Extract the necessary data for plotting
const times = hourlyData.map(d => d.datetime);
const pm25Values = hourlyData.map(d => d.pm25);
const co2Values = hourlyData.map(d => d.co2);
const no2Values = hourlyData.map(d => d.no2);
const so2Values = hourlyData.map(d => d.so2);
const o3Values = hourlyData.map(d => d.o3);
const pm10Values = hourlyData.map(d => d.pm10);
const limits = hourlyData.map(d => d.limit);

// Create traces for each pollutant
var trace1 = {
    type: "scatter",
    mode: "lines",
    x: times,
    y: pm25Values,
    name: 'PM2.5',
    line: { color: '#17BECF' },
    hovertemplate: 'Pollutant: PM2.5<br>Value: %{y} µg/m³<br>Limit: %{customdata[0]} µg/m³<br>Datetime: %{x}<extra></extra>',
    customdata: limits
};

var trace2 = {
    type: "scatter",
    mode: "lines",
    x: times,
    y: co2Values,
    name: 'CO2',
    line: { color: '#FF6347' },
    hovertemplate: 'Pollutant: CO2<br>Value: %{y} ppm<br>Limit: %{customdata[0]} ppm<br>Datetime: %{x}<extra></extra>',
    customdata: limits
};

var trace3 = {
    type: "scatter",
    mode: "lines",
    x: times,
    y: no2Values,
    name: 'NO2',
    line: { color: '#FFD700' },
    hovertemplate: 'Pollutant: NO2<br>Value: %{y} µg/m³<br>Limit: %{customdata[0]} µg/m³<br>Datetime: %{x}<extra></extra>',
    customdata: limits
};

var trace4 = {
    type: "scatter",
    mode: "lines",
    x: times,
    y: so2Values,
    name: 'SO2',
    line: { color: '#8A2BE2' },
    hovertemplate: 'Pollutant: SO2<br>Value: %{y} µg/m³<br>Limit: %{customdata[0]} µg/m³<br>Datetime: %{x}<extra></extra>',
    customdata: limits
};

var trace5 = {
    type: "scatter",
    mode: "lines",
    x: times,
    y: o3Values,
    name: 'O3',
    line: { color: '#DC143C' },
    hovertemplate: 'Pollutant: O3<br>Value: %{y} µg/m³<br>Limit: %{customdata[0]} µg/m³<br>Datetime: %{x}<extra></extra>',
    customdata: limits
};

var trace6 = {
    type: "scatter",
    mode: "lines",
    x: times,
    y: pm10Values,
    name: 'PM10',
    line: { color: '#7F7F7F' },
    hovertemplate: 'Pollutant: PM10<br>Value: %{y} µg/m³<br>Limit: %{customdata[0]} µg/m³<br>Datetime: %{x}<extra></extra>',
    customdata: limits
};

// Combine the traces into a data array
var data = [trace1, trace2, trace3, trace4, trace5, trace6];

// Layout settings for the graph
var layoutConfig = {
    title: 'Air Pollution Data for 6 Pollutants (Time Series)',
    xaxis: {
        title: 'Date and Time',
        type: 'category',
        tickangle: 45, // Slightly rotate tick labels for better visibility
        tickmode: 'array', // Use custom tick values and labels
        tickvals: times, // Ensure all specific hours are shown
        ticktext: specificHours, // Use human-readable date-time labels
        dtick: 2 // Add spacing between ticks (adjust this for your dataset)
    },
    yaxis: {
        title: 'Pollutant Concentration',
        autorange: true
    },
    showlegend: true,
    height: 600,
    margin: { t: 40, b: 80, l: 50, r: 40 }, // Increased bottom margin for tick labels
    hovermode: 'closest',
    transitions: { duration: 500 }
};

// Plot the graph
Plotly.newPlot('BarChart', data, layoutConfig);
