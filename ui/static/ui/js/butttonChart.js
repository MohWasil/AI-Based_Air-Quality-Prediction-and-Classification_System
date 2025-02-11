// Generate three days' dates
const daysCustomerange = Array.from({ length: 3 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

// Define the hours for each day (6 AM to 8 AM and 5 PM to 7 PM)
const hours = [
    "6 AM", "7 AM", "8 AM", "5 PM", "6 PM", "7 PM"
];

// Simulated pollution data for six pollutants across three days and specific hours
const pollutantsCustomerange = ['CO', 'NO2', 'SO2', 'PM2.5', 'PM10', 'O3'];
const zDataCustomerange = pollutantsCustomerange.map(() =>
    Array.from({ length: 18 }, () => Math.random() * 100) // 3 days * 6 hours = 18 points
);

// Mapping the hours to each day
const xDataCustomerange = [];
daysCustomerange.forEach(day => {
    hours.forEach(hour => {
        xDataCustomerange.push(`${day} | ${hour}`);
    });
});

// Layout and data for the chart
const dataCustomerange = [{
    z: zDataCustomerange,
    x: xDataCustomerange,
    y: pollutantsCustomerange,
    type: 'surface',
    colorscale: 'Viridis',
    colorbar: {
        tickvals: [0, 50, 100],
        ticktext: ['0', '50', '100'],
        outlinewidth: 0,
        ticks: 'outside',
        ticklen: 5,
        tickcolor: 'rgb(255,255,255)' // Adjusted color for clarity
    },
    hovertemplate: 'Date and Time: %{x}<br>Pollutant: %{y}<br>Value: %{z:.2f}<br><extra></extra>',
}];

// UI Elements for the buttons
const buttonLayer1HeightCustomerange = 1.12;
const buttonLayer2HeightCustomerange = 1.0;
const annotationOffsetCustomerange = 0.04;

// Update menus configuration
const updatemenusCustomerange = [
    {
        buttons: [
            { args: ['type', 'surface'], label: '3D Surface', method: 'restyle' },
            { args: ['type', 'heatmap'], label: 'Heatmap', method: 'restyle' },
            { args: ['type', 'contour'], label: 'Contour', method: 'restyle' }
        ],
        direction: 'left',
        pad: { 'r': 10, 't': 10 },
        showactive: true,
        type: 'buttons',
        x: 0.15,
        xanchor: 'left',
        y: buttonLayer2HeightCustomerange,
        yanchor: 'top'
    },
    {
        buttons: [
            { args: ['reversescale', true], label: 'Reverse', method: 'restyle' },
            { args: ['reversescale', false], label: 'Undo Reverse', method: 'restyle' }
        ],
        direction: 'down',
        pad: { 'r': 10, 't': 10 },
        showactive: true,
        type: 'dropdown',
        x: 0.56,
        xanchor: 'left',
        y: buttonLayer2HeightCustomerange,
        yanchor: 'top'
    },
    {
        buttons: [
            { args: [{ 'contours.showlines': false, 'type': 'contour' }], label: 'Hide lines', method: 'restyle' },
            { args: [{ 'contours.showlines': true, 'type': 'contour' }], label: 'Show lines', method: 'restyle' }
        ],
        direction: 'down',
        pad: { 'r': 10, 't': 10 },
        showactive: true,
        type: 'dropdown',
        x: 0.78,
        xanchor: 'left',
        y: buttonLayer2HeightCustomerange,
        yanchor: 'top'
    },
    {
        buttons: [
            { args: ['colorscale', 'Viridis'], label: 'Viridis', method: 'restyle' },
            { args: ['colorscale', 'Electric'], label: 'Electric', method: 'restyle' },
            { args: ['colorscale', 'Earth'], label: 'Earth', method: 'restyle' },
            { args: ['colorscale', 'Hot'], label: 'Hot', method: 'restyle' },
            { args: ['colorscale', 'Jet'], label: 'Jet', method: 'restyle' },
            { args: ['colorscale', 'Portland'], label: 'Portland', method: 'restyle' },
            { args: ['colorscale', 'Rainbow'], label: 'Rainbow', method: 'restyle' },
            { args: ['colorscale', 'Blackbody'], label: 'Blackbody', method: 'restyle' },
            { args: ['colorscale', 'Cividis'], label: 'Cividis', method: 'restyle' }
        ],
        direction: 'left',
        pad: { 'r': 10, 't': 10 },
        showactive: true,
        type: 'buttons',
        x: 0.15,
        xanchor: 'left',
        y: buttonLayer1HeightCustomerange,
        yanchor: 'top'
    }
];

// Annotations for the chart
const annotationsCustomerange = [
    { text: 'Trace type:', x: 0, y: buttonLayer2HeightCustomerange - annotationOffsetCustomerange, yref: 'paper', align: 'left', showarrow: false },
    { text: 'Colorscale:', x: 0, y: buttonLayer1HeightCustomerange - annotationOffsetCustomerange, yref: 'paper', align: 'left', showarrow: false }
];

// Layout with minor adjustments for clarity
const layoutCustomerange = {
    margin: { t: 0, b: 0, l: 0, r: 0 },
    updatemenus: updatemenusCustomerange,
    annotations: annotationsCustomerange,
    scene: {
        xaxis: {
            title: 'Date and Time',
            gridcolor: 'rgb(255, 255, 255)',
            zerolinecolor: 'rgb(255, 255, 255)',
            showbackground: true,
            backgroundcolor: 'rgb(230, 230,230)'
        },
        yaxis: {
            title: 'Pollutants',
            gridcolor: 'rgb(255, 255, 255)',
            zerolinecolor: 'rgb(255, 255, 255)',
            showbackground: true,
            backgroundcolor: 'rgb(230, 230, 230)'
        },
        zaxis: {
            title: 'Concentration',
            gridcolor: 'rgb(255, 255, 255)',
            zerolinecolor: 'rgb(255, 255, 255)',
            showbackground: true,
            backgroundcolor: 'rgb(230, 230,230)'
        },
        aspectratio: { x: 1, y: 1, z: 0.7 },
        aspectmode: 'manual'
    }
};

// Create the plot
Plotly.newPlot("densityChart", dataCustomerange, layoutCustomerange);
