const category = document.querySelector(`#category`);
const movieTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.submit button');
const modal = document.querySelector('#exampleModal');
const pagination = document.querySelector('.pagination');
let currentPage = 1;
const rowsPerPage = 10;

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3OTg4OTIzLCJleHAiOjE3NjkwOTI5MjN9.9Hztt689ECGP3QyArKno3NNKfX2Uu8HlFe1s132RzCc";



// GET Movies
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    displayMovies(data.data, movieTableBody, rowsPerPage, currentPage);
    setupPagination(data.data, pagination, rowsPerPage);
  } catch (error) {
    console.error("Error:", error);
  }
}
async function fetchCategories(endpoint) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    categoriesList = data.data;
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayMovies(movies, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedMovies = movies.slice(start, end);

  paginatedMovies.forEach(movie => {
    addMovieToTable(movie);
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
    displayMovies(items, movieTableBody, rowsPerPage, currentPage);

    const currentBtn = document.querySelector('.pagination button.active');
    if (currentBtn) currentBtn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

function addMovieToTable(movie) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <th scope="row">${movie.id}</th>
    <td>${movie.title}</td>
    <td>${movie.overview.slice(0,30)}</td>
    <td>${movie.category.name}</td>
    <td>${movie.imdb}</td>
    <td>
      <button class="btn btn-primary edit-btn">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button class="btn btn-danger delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  movieTableBody.appendChild(row);
}

(async function init() {
  await fetchCategories('categories'); 
  fetchData('movies'); 
})();
