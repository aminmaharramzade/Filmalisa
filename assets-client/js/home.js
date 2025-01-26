const bgSlider = document.querySelector("#bgSlider");
const dotOne = document.querySelector("#dotOne");
const dotTwo = document.querySelector("#dotTwo");
const dotThree = document.querySelector("#dotThree");
const headerTextArea = document.querySelector(".header-text-area");

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = localStorage.getItem("accessToken");

let movies = [];

const updateBackgroundImage = (index) => {
  const movie = movies[index];
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
  bgSlider.style.backgroundImage = `linear-gradient(to left, #1d1d1d00, #1d1d1dcc), url(${movie.cover_url})`;
  const movieOverview = movie.overview.length > 200 ? movie.overview.slice(0, 200) + "..." : movie.overview;
  headerTextArea.innerHTML = `
    <h4>${movie.category.name}</h4>
    <ul>
      ${starIcon}
    </ul>
    <h1>${movie.title}</h1>
    <p>${movieOverview}</p>
    <div class="watch-btn"><a href="${movie.watch_url}">Watch now</a></div>
  `;
  dotOne.src =
    index === 0
      ? "../assets/icons/active-dot-icon.svg"
      : "../assets/icons/deactive-dot-icon.svg";
  dotTwo.src =
    index === 1
      ? "../assets/icons/active-dot-icon.svg"
      : "../assets/icons/deactive-dot-icon.svg";
  dotThree.src =
    index === 2
      ? "../assets/icons/active-dot-icon.svg"
      : "../assets/icons/deactive-dot-icon.svg";
};

dotOne.addEventListener("click", () => {
  currentIndex = 0;
  updateBackgroundImage(currentIndex);
});

dotTwo.addEventListener("click", () => {
  currentIndex = 1;
  updateBackgroundImage(currentIndex);
});

dotThree.addEventListener("click", () => {
  currentIndex = 2;
  updateBackgroundImage(currentIndex);
});

let currentIndex = 0;
// slide vaxti
setInterval(() => {
  currentIndex = (currentIndex + 1) % movies.length;
  updateBackgroundImage(currentIndex);
}, 5000);

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

    movies = data.data.sort(() => 0.5 - Math.random()).slice(0, 3);
    updateBackgroundImage(currentIndex);

    const actionCardArea = document.querySelector(".action-card-area");
    const comedyCardArea = document.querySelector(".comedy-card-area");
    actionCardArea.innerHTML = "";
    comedyCardArea.innerHTML = "";

    data.data.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("action-card");
      card.innerHTML = `
        <img src="${movie.cover_url}" alt="${movie.title}" class="background-image" />
        <h4>${movie.category.name}</h4>
        <h1>${movie.title}</h1>
      `;
      if (movie.category.name === "Action") {
        comedyCardArea.appendChild(card);
      } else {
        actionCardArea.appendChild(card);
      }
      card.addEventListener("click", () => {
        window.location.href = `../pages/details.html?id=${movie.id}`;
      });
    });

    data.data.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("comedy-card");
      card.innerHTML = `
        <img src="${movie.cover_url}" alt="${movie.title}" class="background-image" />
        <h4>${movie.category.name}</h4>
        <h1>${movie.title}</h1>
      `;
      if (movie.category.name === "Comedy") {
        actionCardArea.appendChild(card);
      } else {
        comedyCardArea.appendChild(card);
      }
      card.addEventListener("click", () => {
        window.location.href = `../pages/details.html?id=${movie.id}`;
      });
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData("movies");
