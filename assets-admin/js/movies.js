const category = document.querySelector(`#category`);
const movieTableBody = document.querySelector(".movie-table tbody");
const submitButton = document.querySelector(".submit button");
const modal = document.querySelector("#exampleModal");
const pagination = document.querySelector(".pagination");
const moviesForm = document.querySelector(".movies-form");
let currentPage = 1;
const rowsPerPage = 10;

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = localStorage.getItem("accessToken");

// Notification function
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

// Fetch Movies
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
    displayMovies(data.data, movieTableBody, rowsPerPage, currentPage);
    setupPagination(data.data, pagination, rowsPerPage);
  } catch (error) {
    console.error("Error:", error);
    showNotification("error", error.message || "Something went wrong.");
  }
}

// Fetch Actors
async function fetchActors() {
  try {
    const response = await fetch(`${baseURL}/actors`, {
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
    const actorSelect = document.getElementById("actor");
    const editActorSelect = document.getElementById("editActor");

    actorSelect.innerHTML = "<option selected disabled>Choose actor</option>";
    editActorSelect.innerHTML =
      "<option selected disabled>Choose actor</option>";

    data.data.forEach((actor) => {
      const option = document.createElement("option");
      option.value = actor.id;
      option.textContent = actor.name;
      actorSelect.appendChild(option);
      editActorSelect.appendChild(option.cloneNode(true));
    });
  } catch (error) {
    console.error("Error:", error);
    showNotification("error", error.message || "Something went wrong.");
  }
}

// Fetch Categories
async function fetchCategories(endpoint) {
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
    category.innerHTML = "<option selected disabled>Choose category</option>";
    const editCategorySelect = document.getElementById("editCategory");
    editCategorySelect.innerHTML =
      "<option selected disabled>Choose category</option>";

    data.data.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat.id;
      option.textContent = cat.name;
      category.appendChild(option);
      editCategorySelect.appendChild(option.cloneNode(true));
    });
  } catch (error) {
    console.error("Error:", error);
    showNotification("error", error.message || "Something went wrong.");
  }
}

// POST Movie
async function createMovie(movieData) {
  try {
    const response = await fetch(`${baseURL}/movie`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error response:", errorData);
      showNotification(
        "error",
        `Error: ${response.status} - ${errorData.message}`
      );
      return;
    }

    const data = await response.json();
    addMovieToTable(data.data);
    showNotification("success", "Movie successfully added!");

    document.querySelector(".movies-form").reset();
    const modalInstance = bootstrap.Modal.getInstance(
      document.getElementById("exampleModal")
    );
    modalInstance.hide();

    fetchData("movies");
  } catch (error) {
    console.error("Error:", error);
    showNotification("error", error.message);
  }
}

// Handle form submission
document
  .querySelector(".movies-form")
  .addEventListener("submit", async (event) => {
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
      actors: [...document.getElementById("actor").selectedOptions].map((opt) =>
        parseInt(opt.value)
      ),
      overview: document.getElementById("overview").value,
    };

    createMovie(movieData);
  });

// PUT Movie
async function sendUpdateRequest(movieId, updatedMovieData) {
  try {
    const response = await fetch(`${baseURL}/movie/${movieId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMovieData),
    });

    if (response.ok) {
      await response.json();
      showNotification("success", "Movie successfully updated!");

      const modal = bootstrap.Modal.getInstance(
        document.getElementById("editMovieModal")
      );
      modal.hide();

      fetchData("movies");
    } else {
      const errorData = await response.json();
      showNotification(
        "error",
        `Error: ${errorData.message || response.status}`
      );
    }
  } catch (error) {
    showNotification("error", `Error: ${error.message}`);
  }
}

// Display Movies
function displayMovies(movies, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedMovies = movies.slice(start, end);

  paginatedMovies.forEach((movie) => {
    addMovieToTable(movie);
  });
}

// Setup Pagination
function setupPagination(items, wrapper, rowsPerPage) {
  wrapper.innerHTML = "";

  const pageCount = Math.ceil(items.length / rowsPerPage);
  for (let i = 1; i < pageCount + 1; i++) {
    const btn = paginationButton(i, items);
    wrapper.appendChild(btn);
  }
}

// Pagination Button
function paginationButton(page, items) {
  const button = document.createElement("button");
  button.innerText = page;
  button.style.backgroundColor = "#58209d";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.margin = "0 5px";
  button.style.padding = "5px 10px";
  button.style.borderRadius = "5px";

  if (currentPage == page) button.classList.add("active");

  button.addEventListener("click", function () {
    currentPage = page;
    displayMovies(items, movieTableBody, rowsPerPage, currentPage);

    const currentBtn = document.querySelector(".pagination button.active");
    if (currentBtn) currentBtn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
}

// Add Movie to Table
function addMovieToTable(movie) {
  const row = document.createElement("tr");
  row.setAttribute("data-id", movie.id);
  row.innerHTML = `<th scope="row">${movie.id}</th>
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
    </td>`;

  movieTableBody.appendChild(row);

  row.querySelector(".delete-btn").addEventListener("click", () => {
    const deleteModal = new bootstrap.Modal(
      document.getElementById("deleteConfirmationModal")
    );
    deleteModal.show();

    document.getElementById("confirmDeleteBtn").onclick = () => {
      deleteMovie(movie.id);
      deleteModal.hide();
    };
  });

  row.querySelector(".edit-btn").addEventListener("click", async () => {
    await fetchCategories("categories");
    await fetchActors();

    document.getElementById("editTitle").value = movie.title;
    document.getElementById("editOverview").value = movie.overview;
    document.getElementById("editCoverUrl").value = movie.cover_url;
    document.getElementById("editTrailerUrl").value = movie.fragman;
    document.getElementById("editWatchUrl").value = movie.watch_url;
    document.getElementById("editImdb").value = movie.imdb;
    document.getElementById("editRuntime").value = movie.run_time_min;
    document.getElementById("editCategory").value = movie.category.id;
    const editActorSelect = document.getElementById("editActor");
    if (Array.isArray(movie.actors)) {
      Array.from(editActorSelect.options).forEach((option) => {
        option.selected = movie.actors.some(
          (actor) => actor.id === Number(option.value)
        );
      });
    }
    document.getElementById("editAdult").checked = movie.adult;

    const editModal = new bootstrap.Modal(
      document.getElementById("editMovieModal")
    );
    editModal.show();

    document.getElementById("saveEditMovieBtn").onclick = async (event) => {
      event.preventDefault(); // Prevent form submission
      const updatedMovieData = {};
      if (document.getElementById("editTitle").value !== movie.title)
        updatedMovieData.title = document.getElementById("editTitle").value;
      if (document.getElementById("editOverview").value !== movie.overview)
        updatedMovieData.overview =
          document.getElementById("editOverview").value;
      if (document.getElementById("editCoverUrl").value !== movie.cover_url)
        updatedMovieData.cover_url =
          document.getElementById("editCoverUrl").value;
      if (document.getElementById("editTrailerUrl").value !== movie.fragman)
        updatedMovieData.fragman =
          document.getElementById("editTrailerUrl").value;
      if (document.getElementById("editWatchUrl").value !== movie.watch_url)
        updatedMovieData.watch_url =
          document.getElementById("editWatchUrl").value;
      if (document.getElementById("editImdb").value !== movie.imdb)
        updatedMovieData.imdb = document.getElementById("editImdb").value;
      if (
        parseInt(document.getElementById("editRuntime").value) !==
        movie.run_time_min
      )
        updatedMovieData.run_time_min = parseInt(
          document.getElementById("editRuntime").value
        );
      if (
        parseInt(document.getElementById("editCategory").value) !==
        movie.category.id
      )
        updatedMovieData.category = parseInt(
          document.getElementById("editCategory").value
        );
      const selectedActors = [
        ...document.getElementById("editActor").selectedOptions,
      ].map((opt) => parseInt(opt.value));
      if (
        Array.isArray(movie.actors) &&
        JSON.stringify(selectedActors) !==
          JSON.stringify(movie.actors.map((actor) => actor.id))
      ) {
        updatedMovieData.actors = selectedActors;
      }
      if (document.getElementById("editAdult").checked !== movie.adult)
        updatedMovieData.adult = document.getElementById("editAdult").checked;

      await sendUpdateRequest(movie.id, updatedMovieData);
      editModal.hide();
    };
  });
}

// DELETE Movie
async function deleteMovie(movieId) {
  try {
    const response = await fetch(`${baseURL}/movie/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    showNotification("success", "Movie successfully deleted!");
    document.querySelector(`tr[data-id="${movieId}"]`).remove();
  } catch (error) {
    showNotification("error", `Error: ${error.message}`);
  }
}

// Initialization
(async function init() {
  await fetchCategories("categories"); // Fetch categories
  await fetchActors(); // Fetch actors
  fetchData("movies"); // Fetch movies or other data
})();
