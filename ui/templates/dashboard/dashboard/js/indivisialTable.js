// Sample Data for Testing
const users = [];
fetch("http://localhost:8000/api/accounts/individual-users?format=json").then(
  (response) => response.json().then((response) => console.log(response))
);
for (let i = 1; i <= 100; i++) {
  users.push({
    id: i,
    fullName: `User ${i}`,
    email: `user${i}@example.com`,
    phone: `+1234567890${i}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    country: `Country ${(i % 10) + 1}`,
  });
}

const rowsPerPage = 14;
let currentPage = 1;

function displayTable(page) {
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const tableBody = document.getElementById("table-body");

  tableBody.innerHTML = "";
  users.slice(startIndex, endIndex).forEach((user) => {
    const row = `<tr>
                                    <td>${user.id}</td>
                                    <td>${user.fullName}</td>
                                    <td>${user.email}</td>
                                    <td>${user.phone}</td>
                                    <td>${user.gender}</td>
                                    <td>${user.country}</td>
                                </tr>`;
    tableBody.innerHTML += row;
  });
}

function setupPagination() {
  const totalPages = Math.ceil(users.length / rowsPerPage);
  const pagination = document.getElementById("pagination");

  // Clear existing page links
  const pageLinks = Array.from(
    pagination.querySelectorAll(
      ".page-item:not(#previous-page):not(#next-page)"
    )
  );
  pageLinks.forEach((link) => link.remove());

  // Determine range of page numbers to display
  const maxVisiblePages = 4;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust the range if there are fewer pages at the beginning or end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item";
    if (i === currentPage) pageItem.classList.add("active");

    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.innerText = i;
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      displayTable(currentPage);
      setupPagination();
    });

    pageItem.appendChild(pageLink);
    pagination.insertBefore(pageItem, document.getElementById("next-page"));
  }

  // Disable/Enable Previous and Next buttons
  document
    .getElementById("previous-page")
    .classList.toggle("disabled", currentPage === 1);
  document
    .getElementById("next-page")
    .classList.toggle("disabled", currentPage === totalPages);

  document.getElementById("previous-page").onclick = (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayTable(currentPage);
      setupPagination();
    }
  };

  document.getElementById("next-page").onclick = (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      displayTable(currentPage);
      setupPagination();
    }
  };
}

// Initialize Table and Pagination
displayTable(currentPage);
setupPagination();
