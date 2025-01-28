const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";
const commentTableBody = document.querySelector(`.movie-table tbody`);
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
    displayComments(data.data, commentTableBody, rowsPerPage, currentPage);
    setupPagination(data.data, pagination, rowsPerPage);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayComments(comments, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedComments = comments.slice(start, end);

  paginatedComments.forEach(comment => {
    addCommentsToTable(comment);
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
    displayComments(items, commentTableBody, rowsPerPage, currentPage);

    const currentBtn = document.querySelector('.pagination button.active');
    if (currentBtn) currentBtn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

function addCommentsToTable(comment) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${comment.id}</th>
    <td>${comment.comment}</td>
    <td>${comment.movie.title}</td>
    <td>
      <button class="btn btn-danger delete-btn" data-id="${comment.id}" data-movie-id="${comment.movie.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  commentTableBody.appendChild(row);

  row.querySelector(".delete-btn").addEventListener("click", async (event) => {
    const commentId = event.target.closest("button").dataset.id;
    const movieId = event.target.closest("button").dataset.movieId;
    await removeComment(movieId, commentId);
    row.remove();
  });
}

fetchData(`comments`);

// DELETE
async function removeComment(movieId, commentId) {
  try {
    const response = await fetch(
      `${baseURL}/movies/${movieId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    console.log(`Comment ${commentId} deleted successfully`);
  } catch (error) {
    console.error("Error:", error);
  }
}
