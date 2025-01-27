const category = document.querySelector(`#category`);
const movieTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.submit button');
const modal = document.querySelector('#exampleModal');

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3OTg4OTIzLCJleHAiOjE3NjkwOTI5MjN9.9Hztt689ECGP3QyArKno3NNKfX2Uu8HlFe1s132RzCc";
let editMode = false;
let editRow = null;

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

function addMovieToTable(movie) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <th scope="row">${movie.id}</th>
    <td>${movie.title}</td>
    <td>${movie.overview}</td>
    <td>${movie.category}</td>
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

  row.querySelector('.delete-btn').addEventListener('click', function() {
    row.remove();
  });


  row.querySelector('.edit-btn').addEventListener('click', function() {
    editMode = true;
    editRow = row;
    document.querySelector('#title').value = movie.title;
    document.querySelector('#overview').value = movie.overview;
    document.querySelector('#imdb').value = movie.imdb;
    category.value = movie.category;
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  });
}

submitButton.addEventListener('click', function(event) {
  event.preventDefault();
  
  const title = document.querySelector('#title').value;
  const overview = document.querySelector('#overview').value;
  const categoryValue = category.value;
  const imdb = document.querySelector('#imdb').value;
  
  if (editMode) {
    editRow.querySelector('td:nth-child(2)').textContent = title;
    editRow.querySelector('td:nth-child(3)').textContent = overview;
    editRow.querySelector('td:nth-child(4)').textContent = categoryValue;
    editRow.querySelector('td:nth-child(5)').textContent = imdb;
    editMode = false;
    editRow = null;
  } else {
    const newMovie = {
      id: movieTableBody.children.length + 1,
      title: title,
      overview: overview,
      category: categoryValue,
      imdb: imdb
    };
    addMovieToTable(newMovie);
  }

  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  // Reset the modal values
  document.querySelector('#title').value = '';
  document.querySelector('#overview').value = '';
  document.querySelector('#coverUrl').value = '';
  document.querySelector('#trailerUrl').value = '';
  document.querySelector('#watchUrl').value = '';
  document.querySelector('#imdb').value = '';
  document.querySelector('#runtime').value = '';
  category.selectedIndex = 0;
});

fetchData('movies');
