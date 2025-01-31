const category = document.querySelector(`#category`);
const movieTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.submit button');
const modal = document.querySelector('#exampleModal');
const pagination = document.querySelector('.pagination');
const moviesForm = document.querySelector(".movies-form");
let currentPage = 1;
const rowsPerPage = 10;

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3OTg4OTIzLCJleHAiOjE3NjkwOTI5MjN9.9Hztt689ECGP3QyArKno3NNKfX2Uu8HlFe1s132RzCc";

function showNotification(type, message) {
  toastr.options = {
    positionClass: "toast-top-right",
    timeOut: 3000,
  };

  if (type === "success") {
    toastr.success(message);
  } else if (type === "error") {
    toastr.error(message);
  } else if (type === "info") {
    toastr.info(message);
  } else if (type === "warning") {
    toastr.warning(message);
  }
}



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
async function fetchActors() {
  try {
    const response = await fetch(`${baseURL}/actors`, {
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
    const actorSelect = document.getElementById("actor");


    actorSelect.innerHTML = '<option selected disabled>Choose actor</option>';

    data.data.forEach(actor => {
      const option = document.createElement("option");
      option.value = actor.id;
      option.textContent = actor.name;
      actorSelect.appendChild(option);
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
    category.innerHTML = '<option selected disabled>Choose category</option>';

    data.data.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      category.appendChild(option);
    });
  } catch (error) {
    console.error("Error:", error);
  }


}
// POST Movies
document.querySelector(".movies-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  const movieData = {
    title: document.getElementById("title").value,
    cover_url: document.getElementById("coverUrl").value,
    fragman: document.getElementById("trailerUrl").value,
    watch_url: document.getElementById("watchUrl").value,
    adult: document.getElementById("adult").checked,
    run_time_min: parseInt(document.getElementById("runtime").value),
    imdb: document.getElementById("imdb").value,
    category: parseInt(document.getElementById("category").value),
    actors: [...document.getElementById("actor").selectedOptions].map(opt => parseInt(opt.value)),
    overview: document.getElementById("overview").value
  };


  try {
    const response = await fetch(`${baseURL}/movie`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });


    if (response.ok) {
      const data = await response.json();
      addMovieToTable(data.data);
      showNotification("success", "Movie successfully added!");


      document.querySelector(".movies-form").reset();

      const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
      modal.hide();

      fetchData('movies');
    } else {
      showNotification("error", "Error: " + response.status);
    }
  } catch (error) {
    showNotification("error", error.message);
  }
});

// PUT Movies and 
// PUT Movies - Updating an existing movie
async function editMovie(movieId, movieData) {
  document.getElementById('editTitle').value = movieData.title;
  document.getElementById('editOverview').value = movieData.overview;
  document.getElementById('editCoverUrl').value = movieData.coverUrl;
  document.getElementById('editTrailerUrl').value = movieData.trailerUrl;
  document.getElementById('editWatchUrl').value = movieData.watchUrl;
  document.getElementById('editImdb').value = movieData.imdb;
  document.getElementById('editRuntime').value = movieData.runtime;
  document.getElementById('editCategory').value = movieData.category;
  document.getElementById('editActor').value = movieData.actor;
  document.getElementById('editAdult').checked = movieData.adult;



  try {
    const response = await fetch(`${baseURL}/movie/${movieId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    showNotification("success", "Movie updated successfully!");

    const row = document.querySelector(`tr[data-id="${movieId}"]`);
    row.querySelector('td').textContent = movieData.title;
  } catch (error) {
    showNotification("error", "Request Error: " + error.message);
  }
}



async function sendUpdateRequest(movieId, updatedMovieData) {
  try {
    const response = await fetch(`${baseURL}/movie/${movieId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMovieData),
    });

    if (response.ok) {
      await response.json();
      showNotification("success", "Movie successfully updated!");

      const modal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal'));
      modal.hide();

      fetchData('movies');
    } else {
      const errorData = await response.json();
      showNotification("error", `Error: ${errorData.message || response.status}`);
    }
  } catch (error) {
    showNotification("error", `Error: ${error.message}`);
  }
}

// document.querySelector(".edit-movie-form").addEventListener("submit", updateMovie(movieId));


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
  row.setAttribute('data-id', movie.id);
  row.innerHTML = `
    <th scope="row">${movie.id}</th>
    <td>${movie.title}</td>
    <td>${movie.overview.slice(0, 30)}</td>
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

  row.querySelector('.delete-btn').addEventListener('click', () => {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    deleteModal.show();

    document.getElementById('confirmDeleteBtn').onclick = () => {
      deleteMovie(movie.id);
      deleteModal.hide();
    };
  });

  row.querySelector('.edit-btn').addEventListener('click', () => {
    document.getElementById('editTitle').value = movie.title;
    document.getElementById('editOverview').value = movie.overview;
    document.getElementById('editCoverUrl').value = movie.cover_url;
    document.getElementById('editTrailerUrl').value = movie.fragman;
    document.getElementById('editWatchUrl').value = movie.watch_url;
    document.getElementById('editImdb').value = movie.imdb;
    document.getElementById('editRuntime').value = movie.run_time_min;
    document.getElementById('editCategory').value = movie.category.name;
    document.getElementById('editActor').value = movie.actor;
    document.getElementById('editAdult').checked = movie.adult;

    const editModal = new bootstrap.Modal(document.getElementById('editMovieModal'));
    editModal.show();

    document.getElementById('saveEditMovieBtn').onclick = () => {
      const updatedMovieData = {
        title: document.getElementById('editTitle').value,
        overview: document.getElementById('editOverview').value,
        cover_url: document.getElementById('editCoverUrl').value,
        fragman: document.getElementById('editTrailerUrl').value,
        watch_url: document.getElementById('editWatchUrl').value,
        imdb: document.getElementById('editImdb').value,
        run_time_min: parseInt(document.getElementById('editRuntime').value),
        category: parseInt(document.getElementById('editCategory').value),
        actors: [...document.getElementById('editActor').selectedOptions].map(opt => parseInt(opt.value)),
        adult: document.getElementById('editAdult').checked
      };
      sendUpdateRequest(movie.id, updatedMovieData);
      editModal.hide();
    };
  });
}

// DELETE Movies
async function deleteMovie(movieId) {
  try {
    const response = await fetch(`${baseURL}/movie/${movieId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    showNotification("success", "Movie successfully deleted!");
    document.querySelector(`tr[data-id="${movieId}"]`).remove();
  } catch (error) {
    showNotification("error", "Error: " + error.message);
  }
}

(async function init() {
  await fetchCategories('categories'); // Fetch categories
  await fetchActors(); // Fetch actors
  fetchData('movies'); // Fetch movies or other data
})();
