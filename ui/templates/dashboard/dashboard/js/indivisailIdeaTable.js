// Sample Data for Individual Ideas
const individualIdeas = [];
for (let i = 1; i <= 100; i++) {
    individualIdeas.push({
        id: i,
        fullName: `Individual ${i}`,
        email: `individual${i}@example.com`,
        phone: `+1234567890${i}`,
        expertise: `Expertise ${i % 5 + 1}`,
        country: `Country ${i % 10 + 1}`,
        idea: `This is the idea of Individual ${i}.`
    });
}

const indivisialRowsPerPage = 14; // Rows per page
let indivisialCurrentPage = 1; // Current page

function displayIndivisialTable(page) {
    const startIndex = (page - 1) * indivisialRowsPerPage;
    const endIndex = startIndex + indivisialRowsPerPage;
    const tableBody = document.getElementById('indivisailIdeaTableBody');

    tableBody.innerHTML = '';
    individualIdeas.slice(startIndex, endIndex).forEach(indiv => {
        const row = `<tr>
                        <td>${indiv.id}</td>
                        <td>${indiv.fullName}</td>
                        <td>${indiv.email}</td>
                        <td>${indiv.phone}</td>
                        <td>${indiv.expertise}</td>
                        <td>${indiv.country}</td>
                        <td>${indiv.idea}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

function setupIndivisialPagination() {
    const totalPages = Math.ceil(individualIdeas.length / indivisialRowsPerPage);
    const pagination = document.getElementById('indivisailPagination');

    // Check if pagination element exists
    if (!pagination) {
        console.error("Pagination container not found.");
        return;
    }

    const nextPageElement = document.getElementById('indivisialNextPage');
    if (!nextPageElement) {
        console.error("Element with id 'indivisialNextPage' not found.");
        return;
    }

    // Remove old page links
    const pageLinks = Array.from(pagination.querySelectorAll('.page-item:not(#indivisialPreviousPage):not(#indivisialNextPage)'));
    pageLinks.forEach(link => link.remove());

    // Set up page range
    const maxVisiblePages = 4; // Only show 4 pages
    let startPage = Math.max(1, indivisialCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add page links
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        if (i === indivisialCurrentPage) pageItem.classList.add('active');

        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.innerText = i;

        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            indivisialCurrentPage = i;
            displayIndivisialTable(indivisialCurrentPage);
            setupIndivisialPagination();
        });

        pageItem.appendChild(pageLink);
        pagination.insertBefore(pageItem, nextPageElement);
    }

    // Enable/disable previous and next buttons
    document.getElementById('indivisialPreviousPage').classList.toggle('disabled', indivisialCurrentPage === 1);
    document.getElementById('indivisialNextPage').classList.toggle('disabled', indivisialCurrentPage === totalPages);

    // Set up previous button functionality
    document.getElementById('indivisialPreviousPage').onclick = (e) => {
        e.preventDefault();
        if (indivisialCurrentPage > 1) {
            indivisialCurrentPage--;
            displayIndivisialTable(indivisialCurrentPage);
            setupIndivisialPagination();
        }
    };

    // Set up next button functionality
    document.getElementById('indivisialNextPage').onclick = (e) => {
        e.preventDefault();
        if (indivisialCurrentPage < totalPages) {
            indivisialCurrentPage++;
            displayIndivisialTable(indivisialCurrentPage);
            setupIndivisialPagination();
        }
    };
}

// Initialize table and pagination
document.addEventListener('DOMContentLoaded', () => {
    displayIndivisialTable(indivisialCurrentPage);
    setupIndivisialPagination();
});
