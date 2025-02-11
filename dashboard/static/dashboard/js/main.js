document.getElementById('toggleSidebar').addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('hide');
});

const followersCtx = document.getElementById('followersByCountry').getContext('2d');
new Chart(followersCtx, {
    type: 'bar',
    data: {
        labels: ['USA', 'Canada', 'UK', 'Germany', 'India'],
        datasets: [{
            label: 'Followers',
            data: [1200, 900, 750, 500, 300],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
        }]
    },
    options: { responsive: true }
});

const accountsCtx = document.getElementById('accountsDistribution').getContext('2d');
new Chart(accountsCtx, {
    type: 'pie',
    data: {
        labels: ['Individual', 'Organization'],
        datasets: [{
            data: [1234, 567],
            backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 159, 64, 0.7)'],
        }]
    },
    options: { responsive: true }
});