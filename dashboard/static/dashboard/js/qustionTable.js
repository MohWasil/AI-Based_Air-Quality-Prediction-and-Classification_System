// Sample Data for Testing Questions
// for (let i = 1; i <= 100; i++) {
//     qustions.push({
//         id: i,
//         name: `User ${i}`,
//         phone: `+1234567890${i}`,
//         email: `user${i}@example.com`,
//         question: `What is the policy for case ${i}?`
//     });
// }

var questions = [];
const qustionRowsPerPage = 14;
let qustionCurrentPage = 1;

function displayQustionTable(page) {
  const startIndex = (page - 1) * qustionRowsPerPage;
  const endIndex = startIndex + qustionRowsPerPage;
  const tableBody = document.getElementById("questionTableBody");

  tableBody.innerHTML = "";
  questions.slice(startIndex, endIndex).forEach((q) => {
    const row = `<tr>
                        <td>${q.id}</td>
                        <td>${q.name}</td>
                        <td>${q.phone}</td>
                        <td>${q.email}</td>
                        <td>${q.question}</td>
                    </tr>`;
    tableBody.innerHTML += row;
  });
}

function setupQustionPagination() {
  const totalPages = Math.ceil(questions.length / qustionRowsPerPage);
  const pagination = document.getElementById("qustionPagination");

  // Clear existing page links
  const pageLinks = Array.from(
    pagination.querySelectorAll(
      ".page-item:not(#qustionPreviousPage):not(#qustionNextPage)"
    )
  );
  pageLinks.forEach((link) => link.remove());

  // Determine range of page numbers to display
  const maxVisiblePages = 4;
  let startPage = Math.max(
    1,
    qustionCurrentPage - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust the range if there are fewer pages at the beginning or end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item";
    if (i === qustionCurrentPage) pageItem.classList.add("active");

    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.innerText = i;
    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      qustionCurrentPage = i;
      displayQustionTable(qustionCurrentPage);
      setupQustionPagination();
    });

    pageItem.appendChild(pageLink);
    pagination.insertBefore(
      pageItem,
      document.getElementById("qustionNextPage")
    );
  }

  // Disable/Enable Previous and Next buttons
  document
    .getElementById("qustionPreviousPage")
    .classList.toggle("disabled", qustionCurrentPage === 1);
  document
    .getElementById("qustionNextPage")
    .classList.toggle("disabled", qustionCurrentPage === totalPages);

  document.getElementById("qustionPreviousPage").onclick = (e) => {
    e.preventDefault();
    if (qustionCurrentPage > 1) {
      qustionCurrentPage--;
      displayQustionTable(qustionCurrentPage);
      setupQustionPagination();
    }
  };

  document.getElementById("qustionNextPage").onclick = (e) => {
    e.preventDefault();
    if (qustionCurrentPage < totalPages) {
      qustionCurrentPage++;
      displayQustionTable(qustionCurrentPage);
      setupQustionPagination();
    }
  };
}

// Initialize Table and Pagination
document.addEventListener("DOMContentLoaded", () => {
  fetch(
    "http://localhost:8000/api/feedbacks/questions?format=json"
  ).then((response) =>
    response.json().then((response) => {
      questions = response;
      displayQustionTable(qustionCurrentPage);
      setupQustionPagination();
    })
  );
});
