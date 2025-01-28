const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const token = localStorage.getItem("accessToken");

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

    const playBtn = document.querySelector(".play-icon");
    playBtn.addEventListener("click", function () {
      showPlayModal(data.data);
    });
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

function showPlayModal(movie) {
  const modal = document.createElement("div");

  modal.classList.add("play-modal");
  modal.innerHTML = `
    <div class="play-modal-content" style="background-image: url(${movie.cover_url});">
      <div class="play-modal-overlay"></div>
      <div class="play-modal-details">
        <h1>${movie.title}</h1>
        <div class="play-btn-area">
        <img src="../assets/icons/play-black-icon.svg" alt="play icon"/>
        <a href="${movie.watch_url}" class="play-button">Play</a>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  modal.addEventListener("click", () => {
    modal.remove();
  });
}

async function fetchMovies(endpoint) {
  try {
    const response = await fetch(`${baseURL}/admin/${endpoint}`, {
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

    const comedyCardArea = document.querySelector(".comedy-card-area");
    comedyCardArea.innerHTML = "";

    data.data.forEach((movie) => {
      const rating = Math.round(movie.imdb);
      let starIcon = "";
      let filledStars = 0;

      if (rating >= 1 && rating <= 3) {
        filledStars = 2;
      } else if (rating >= 4 && rating <= 5) {
        filledStars = 3;
      } else if (rating >= 6 && rating <= 7) {
        filledStars = 4;
      } else if (rating >= 8 && rating <= 10) {
        filledStars = 5;
      }

      for (let i = 0; i < 5; i++) {
        if (i < filledStars) {
          starIcon +=
            '<li><img src="../assets/icons/star-raiting.svg" alt="filled star" /></li>';
        }
      }
      const card = document.createElement("div");
      card.classList.add("comedy-card");

      card.addEventListener("click", () => {
        window.location.href = `../pages/details.html?id=${movie.id}`;
      });

      card.innerHTML = `
      <div class="gradient-overlay"></div>
      <img
        src="${movie.cover_url}"
        alt="${movie.title}"
        class="background-image"
      />
      <div class="comedy-card-text">
        <div class=bg-category>
          <h4>${movie.category.name}</h4>
        </div>
        <ul class="star-rating">
          ${starIcon}
        </ul>
        <h1>${movie.title}</h1>
      </div>
    `;
      comedyCardArea.appendChild(card);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchMovies("movies");

async function fetchAccountData(endpoint) {
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
    const account = data.data;

    console.log(data.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchAccountData(`profile`);
