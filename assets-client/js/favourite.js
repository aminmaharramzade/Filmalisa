const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/movies";
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NTc0OTIyLCJleHAiOjE3Njg2Nzg5MjJ9.xM7OU1oOOgk-SicNULAy_ogKRoNy1aiF3SBwVFokyyg`;

async function fetchFavourites(endpoint) {
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
    const favouriteArea = document.querySelector("#favouriteArea");
    favouriteArea.innerHTML = "";

    data.data.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("favourite-card");

      card.addEventListener("click", () => {
        window.location.href = `../pages/details.html?id=${movie.id}`;
      });

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

      card.innerHTML = `
      <div class="gradient-overlay"></div>
      <img
        src="${movie.cover_url}"
        alt="${movie.title}"
        class="background-image"
      />
      <ul class="star-rating">
        ${starIcon}
      </ul>

      <h1>${movie.title}</h1>
    `;

      favouriteArea.appendChild(card);
    });
  } catch (error) {
    console.error(error);
  }
}

fetchFavourites("favorites");
