// داده‌های گراف آلودگی
const pollutionData = {
    labels: ['CO', 'NO', 'NO₂', 'O₃', 'SO₂', 'PM₂.₅'],
    datasets: [{
        label: 'Pollution Levels',
        data: [50, 100, 150, 200, 250, 300], // مقادیر نمونه
        backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
            'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
};

const followersData = {
    labels: ['Men', 'Women', 'Individuals', 'Organizations'],
    datasets: [{
        label: 'Followers and Viewers',
        data: [120, 80, 60, 40], // مقادیر نمونه
        backgroundColor: [
            'rgba(54, 162, 235, 0.5)', // آبی (مردان)
            'rgba(255, 99, 132, 0.5)', // قرمز (زنان)
            'rgba(255, 206, 86, 0.5)', // زرد (انفرادی)
            'rgba(75, 192, 192, 0.5)'  // سبز (سازمان‌ها)
        ],
        borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
    }]
};

// رسم گراف آلودگی
const pollutionCtx = document.getElementById('pollutionGraphCountry').getContext('2d');
new Chart(pollutionCtx, {
    type: 'bar',
    data: pollutionData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// رسم گراف دنبال‌کنندگان و بازدیدکنندگان
const followersCtxCountry = document.getElementById('followersGraphCountry').getContext('2d');
new Chart(followersCtxCountry, {
    type: 'pie',
    data: followersData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            }
        }
    }
});

// ================>


// // Pollution Data for the Bar Chart
// const pollutionData = {
//     labels: ['CO', 'NO', 'NO₂', 'O₃', 'SO₂', 'PM₂.₅'], // Pollution types (labels)
//     datasets: [{
//         label: 'Pollution Levels', // Label for the dataset
//         data: [45, 20, 30, 50, 15, 25], // Sample data for pollution levels, replace with real data from your database
//         backgroundColor: [
//             'rgba(255, 99, 132, 0.5)', // CO - red color
//             'rgba(54, 162, 235, 0.5)', // NO - blue color
//             'rgba(255, 206, 86, 0.5)', // NO₂ - yellow color
//             'rgba(75, 192, 192, 0.5)', // O₃ - green color
//             'rgba(153, 102, 255, 0.5)', // SO₂ - purple color
//             'rgba(255, 159, 64, 0.5)'  // PM₂.₅ - orange color
//         ],
//         borderColor: [
//             'rgba(255, 99, 132, 1)', // Red border for CO
//             'rgba(54, 162, 235, 1)', // Blue border for NO
//             'rgba(255, 206, 86, 1)', // Yellow border for NO₂
//             'rgba(75, 192, 192, 1)', // Green border for O₃
//             'rgba(153, 102, 255, 1)', // Purple border for SO₂
//             'rgba(255, 159, 64, 1)'  // Orange border for PM₂.₅
//         ],
//         borderWidth: 1 // Border width for each bar
//     }]
// };

// // Followers Data for the Pie Chart
// const followersData = {
//     labels: ['Men', 'Women', 'Individuals', 'Organizations'], // Categories for followers
//     datasets: [{
//         label: 'Followers and Viewers', // Label for the dataset
//         data: [120, 80, 60, 40], // Sample data for followers, replace with real data from your database
//         backgroundColor: [
//             'rgba(54, 162, 235, 0.5)', // Men - blue color
//             'rgba(255, 99, 132, 0.5)', // Women - red color
//             'rgba(255, 206, 86, 0.5)', // Individuals - yellow color
//             'rgba(75, 192, 192, 0.5)'  // Organizations - green color
//         ],
//         borderColor: [
//             'rgba(54, 162, 235, 1)', // Blue border for Men
//             'rgba(255, 99, 132, 1)', // Red border for Women
//             'rgba(255, 206, 86, 1)', // Yellow border for Individuals
//             'rgba(75, 192, 192, 1)'  // Green border for Organizations
//         ],
//         borderWidth: 1 // Border width for each segment of the pie chart
//     }]
// };

// // Draw Pollution Graph (Bar Chart)
// const pollutionCtx = document.getElementById('pollutionGraph').getContext('2d');
// new Chart(pollutionCtx, {
//     type: 'bar', // Bar chart type for pollution levels
//     data: pollutionData, // Data to be plotted (pollution data)
//     options: {
//         responsive: true, // Ensure the chart is responsive to screen size
//         plugins: {
//             legend: {
//                 position: 'top', // Position the legend at the top of the chart
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true // Start the Y-axis at zero to accurately represent data
//             }
//         }
//     }
// });

// // Draw Followers Graph (Pie Chart)
// const followersCtx = document.getElementById('followersGraph').getContext('2d');
// new Chart(followersCtx, {
//     type: 'pie', // Pie chart type for followers data
//     data: followersData, // Data to be plotted (followers data)
//     options: {
//         responsive: true, // Ensure the chart is responsive to screen size
//         plugins: {
//             legend: {
//                 position: 'top', // Position the legend at the top of the chart
//             }
//         }
//     }
// });

// // Example of how to replace the sample data with dynamic data from your server/database:
// // For Pollution Data
// fetch('/api/pollution') // Assuming you have an API that returns pollution data
//     .then(response => response.json()) // Parse the JSON data
//     .then(data => {
//         pollutionData.datasets[0].data = data.pollutionLevels; // Replace with real pollution data
//         new Chart(pollutionCtx, {
//             type: 'bar',
//             data: pollutionData,
//             options: { /* same options as before */ }
//         });
//     });

// // For Followers Data
// fetch('/api/followers') // Assuming you have an API that returns follower data
//     .then(response => response.json()) // Parse the JSON data
//     .then(data => {
//         followersData.datasets[0].data = data.followersCounts; // Replace with real follower data
//         new Chart(followersCtx, {
//             type: 'pie',
//             data: followersData,
//             options: { /* same options as before */ }
//         });
//     });
