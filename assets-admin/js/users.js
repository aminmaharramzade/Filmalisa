const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3OTI5NzcwLCJleHAiOjE3NjkwMzM3NzB9.J9Ytl3YcI3HhEGNVWep4iStTkMBYkd_jbHC3U1gSjmo";
const usersTableBody = document.querySelector(`.movie-table tbody`);
const pagination = document.querySelector('.pagination');
let currentPage = 1;
const rowsPerPage = 10;

// GET
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    displayUsers(data.data, usersTableBody, rowsPerPage, currentPage);
    setupPagination(data.data, pagination, rowsPerPage);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayUsers(users, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedUsers = users.slice(start, end);

  paginatedUsers.forEach(user => {
    addUsersToTable(user);
  });
}

function setupPagination(items, wrapper, rowsPerPage) {
  wrapper.innerHTML = "";

  const pageCount = Math.ceil(items.length / rowsPerPage);
  for (let i = 1; i < pageCount + 1; i++) {
    const btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

function paginationButton(page, items) {
  const button = document.createElement('button');
  button.innerText = page;
  button.style.backgroundColor = "#58209d";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.margin = "0 5px";
  button.style.padding = "5px 10px";
  button.style.borderRadius = "5px";

  if (currentPage == page) button.classList.add('active');

  button.addEventListener('click', function () {
    currentPage = page;
    displayUsers(items, usersTableBody, rowsPerPage, currentPage);

    const currentBtn = document.querySelector('.pagination button.active');
    if (currentBtn) currentBtn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

function addUsersToTable(user) {

  function getImgUrl() {
    if(user.img_url === null) {
      return "../assets/images/logo.svg";
    }
    else {
      return user.img_url;
    }
  }

  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${user.id}</th>
    <td>${user.full_name}</td>
    <td>${user.email}</td>
    <td><img style="width: 30px ; height: 40px; object-fit: contain;" src="${getImgUrl()}"></td>
  `;
  usersTableBody.appendChild(row);
}

fetchData(`users`);
