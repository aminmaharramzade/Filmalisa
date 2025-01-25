const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NTc0OTIyLCJleHAiOjE3Njg2Nzg5MjJ9.xM7OU1oOOgk-SicNULAy_ogKRoNy1aiF3SBwVFokyyg`;

async function fetchMovieDetails(id) {
  try {
    const response = await fetch(`${baseURL}/movies/${id}`, {
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
    console.log(data);
    const movieDetails = document.querySelector(".movie-image img");
    movieDetails.src = data.data.cover_url;
    const overview = document.querySelector(".under-watch p");
    overview.textContent = data.data.overview;
    const titleLink = document.querySelector(".movie-details-watch-link h4");
    titleLink.textContent = data.data.title;
    const titleWatchLInk = document.querySelector(
      ".movie-details-watch-link h6"
    );
    titleWatchLInk.addEventListener(`click`, function () {
      window.location.href = `${data.data.watch_url}`;
    });
    const rateImdb = document.querySelector(".rate-area h5");
    rateImdb.textContent = data.data.imdb;
    const dateMovie = document.querySelector("#dateMovie");
    dateMovie.textContent = data.data.created_at.slice(0, 10);
    const runTime = document.querySelector("#runTime");
    runTime.textContent = `${data.data.run_time_min} min`;
    const genres = document.querySelector("#genres");
    genres.textContent = data.data.category.name;
    const bgMovie = document.querySelector(".detail-hero");
    bgMovie.style.backgroundImage = `url(${data.data.cover_url})`;
    const mainGenre = document.querySelector("#mainGenre");
    mainTitle.textContent = data.data.category.name;
    const mainName = document.querySelector("#mainName");
    mainName.textContent = data.data.title;

    const actorsArea = document.querySelector("#actorsArea");
    data.data.actors.forEach((actor) => {
      const actorCard = document.createElement("div");
      actorCard.classList.add("actors-card");
      actorCard.innerHTML = `
         <img src="${actor.img_url}" />
         <p>${actor.name}</p>
         <p>${actor.surname}</p>
      `;
      actorsArea.appendChild(actorCard);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
if (movieId) {
  fetchMovieDetails(movieId);
}

const favBtn = document.querySelector(".search-plus");
favBtn.addEventListener("click", async function () {
  try {
    const response = await fetch(`${baseURL}/movie/${movieId}/favorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie_id: movieId }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    showModal(data.message);
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
});

function showModal(message) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  if (message.includes("removed")) {
    modal.style.backgroundColor = "rgba(203, 66, 66, 0.54)";
  }
  modal.innerHTML = `
    <div class="modal-content">
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(modal);

  setTimeout(() => {
    modal.remove();
  }, 1000);
}
