var orgIdeas = [];
const orgIdeaRowsPerPage = 14;
let orgIdeaCurrentPage = 1;

function displayOrgIdeaTable(page) {
  const startIndex = (page - 1) * orgIdeaRowsPerPage;
  const endIndex = startIndex + orgIdeaRowsPerPage;
  const tableBody = document.getElementById("orgIdeaTableBody");

  tableBody.innerHTML = "";
  orgIdeas.slice(startIndex, endIndex).forEach((org) => {
    const row = `<tr>
                        <td>${org.id}</td>
                        <td>${org.organization_name}</td>
                        <td>${org.responsible_person}</td>
                        <td>${org.official_email}</td>
                        <td>${org.premium_phone}</td>
                        <td>${org.alternative_phone}</td>
                        <td>${org.area_expertise}</td>
                        <td>${org.country}</td>
                        <td>${org.recommendation}</td>
                    </tr>`;
    tableBody.innerHTML += row;
  });
}

function setupOrgIdeaPagination() {
  const totalPages = Math.ceil(orgIdeas.length / orgIdeaRowsPerPage);
  const pagination = document.getElementById("OrgIdeaPagination");

  // بررسی وجود pagination
  if (!pagination) {
    console.error("Pagination container not found.");
    return;
  }

  const nextPageElement = document.getElementById("orgIdeaNextPage");
  if (!nextPageElement) {
    console.error("Element with id 'orgIdeaNextPage' not found.");
    return;
  }

  // پاکسازی لینک‌های قبلی
  const pageLinks = Array.from(
    pagination.querySelectorAll(
      ".page-item:not(#orgIdeaPreviousPage):not(#orgIdeaNextPage)"
    )
  );
  pageLinks.forEach((link) => link.remove());

  // تنظیم محدوده صفحات
  const maxVisiblePages = 5;
  let startPage = Math.max(
    1,
    orgIdeaCurrentPage - Math.floor(maxVisiblePages / 2)
  );
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // افزودن صفحات
  for (let i = startPage; i <= endPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.className = "page-item";
    if (i === orgIdeaCurrentPage) pageItem.classList.add("active");

    const pageLink = document.createElement("a");
    pageLink.className = "page-link";
    pageLink.href = "#";
    pageLink.innerText = i;

    pageLink.addEventListener("click", (e) => {
      e.preventDefault();
      orgIdeaCurrentPage = i;
      displayOrgIdeaTable(orgIdeaCurrentPage);
      setupOrgIdeaPagination();
    });

    pageItem.appendChild(pageLink);
    pagination.insertBefore(pageItem, nextPageElement);
  }

  // فعال/غیرفعال‌سازی دکمه‌های قبلی و بعدی
  document
    .getElementById("orgIdeaPreviousPage")
    .classList.toggle("disabled", orgIdeaCurrentPage === 1);
  document
    .getElementById("orgIdeaNextPage")
    .classList.toggle("disabled", orgIdeaCurrentPage === totalPages);

  // تنظیم عملکرد دکمه قبلی
  document.getElementById("orgIdeaPreviousPage").onclick = (e) => {
    e.preventDefault();
    if (orgIdeaCurrentPage > 1) {
      orgIdeaCurrentPage--;
      displayOrgIdeaTable(orgIdeaCurrentPage);
      setupOrgIdeaPagination();
    }
  };

  // تنظیم عملکرد دکمه بعدی
  document.getElementById("orgIdeaNextPage").onclick = (e) => {
    e.preventDefault();
    if (orgIdeaCurrentPage < totalPages) {
      orgIdeaCurrentPage++;
      displayOrgIdeaTable(orgIdeaCurrentPage);
      setupOrgIdeaPagination();
    }
  };
}

// مقداردهی اولیه جدول و پیجینیشن
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/api/feedbacks/organization-ideas?format=json").then(
    (response) =>
      response.json().then((response) => {
        orgIdeas = response;
        displayOrgIdeaTable(orgIdeaCurrentPage);
        setupOrgIdeaPagination();
      })
  );
});
