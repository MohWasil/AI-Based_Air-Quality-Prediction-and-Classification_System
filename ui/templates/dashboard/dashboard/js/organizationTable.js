// Sample Data for Testing Organizations
const organizations = [];
for (let i = 1; i <= 100; i++) {
    organizations.push({
        id: i,
        orgName: `Organization ${i}`,
        responsiblePerson: `Responsible ${i}`,
        email: `org${i}@example.com`,
        phone: `+1234567890${i}`,
        activity: `Activity ${i % 5 + 1}`,
        address: `Address ${i}`,
        country: `Country ${i % 10 + 1}`
    });
}

const orgRowsPerPage = 14;
let orgCurrentPage = 1;

function displayOrganizationTable(page) {
    const startIndex = (page - 1) * orgRowsPerPage;
    const endIndex = startIndex + orgRowsPerPage;
    const tableBody = document.getElementById('organization-table-body');

    tableBody.innerHTML = '';
    organizations.slice(startIndex, endIndex).forEach(org => {
        const row = `<tr>
                        <td>${org.id}</td>
                        <td>${org.orgName}</td>
                        <td>${org.responsiblePerson}</td>
                        <td>${org.email}</td>
                        <td>${org.phone}</td>
                        <td>${org.activity}</td>
                        <td>${org.address}</td>
                        <td>${org.country}</td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

function setupOrganizationPagination() {
    const totalPages = Math.ceil(organizations.length / orgRowsPerPage);
    const pagination = document.getElementById('organization-pagination');

    // Clear existing page links
    const pageLinks = Array.from(pagination.querySelectorAll('.page-item:not(#org-previous-page):not(#org-next-page)'));
    pageLinks.forEach(link => link.remove());

    // Determine range of page numbers to display
    const maxVisiblePages = 4;
    let startPage = Math.max(1, orgCurrentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust the range if there are fewer pages at the beginning or end
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = 'page-item';
        if (i === orgCurrentPage) pageItem.classList.add('active');

        const pageLink = document.createElement('a');
        pageLink.className = 'page-link';
        pageLink.href = '#';
        pageLink.innerText = i;
        pageLink.addEventListener('click', (e) => {
            e.preventDefault();
            orgCurrentPage = i;
            displayOrganizationTable(orgCurrentPage);
            setupOrganizationPagination();
        });

        pageItem.appendChild(pageLink);
        pagination.insertBefore(pageItem, document.getElementById('org-next-page'));
    }

    // Disable/Enable Previous and Next buttons
    document.getElementById('org-previous-page').classList.toggle('disabled', orgCurrentPage === 1);
    document.getElementById('org-next-page').classList.toggle('disabled', orgCurrentPage === totalPages);

    document.getElementById('org-previous-page').onclick = (e) => {
        e.preventDefault();
        if (orgCurrentPage > 1) {
            orgCurrentPage--;
            displayOrganizationTable(orgCurrentPage);
            setupOrganizationPagination();
        }
    };

    document.getElementById('org-next-page').onclick = (e) => {
        e.preventDefault();
        if (orgCurrentPage < totalPages) {
            orgCurrentPage++;
            displayOrganizationTable(orgCurrentPage);
            setupOrganizationPagination();
        }
    };
}

// Initialize Table and Pagination
document.addEventListener('DOMContentLoaded', () => {
    displayOrganizationTable(orgCurrentPage);
    setupOrganizationPagination();
});
