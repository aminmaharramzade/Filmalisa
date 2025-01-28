const category = document.querySelector(`#category`);
const movieTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.submit button');
const modal = document.querySelector('#exampleModal');

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
    const movieData = data.data
    movieData.forEach(item => {
      addMovieToTable(item);
    });
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
