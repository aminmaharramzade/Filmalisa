const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = localStorage.getItem("accessToken");

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

    function displayMovies(movies) {
      const searchCardArea = document.querySelector("#searchArea");
      searchCardArea.innerHTML = ""; // Clear previous results
      movies.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("search-card");


        // ! rating hesablama
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
          <h4>${movie.category.name}</h4>
          <ul>
            ${starIcon}
          </ul>
          <h1>${movie.title}</h1>
        `;

        searchCardArea.appendChild(card);
      });
    }

    displayMovies(data.data);

    const searchBtn = document.querySelector("#searchBtn");
    const searchInput = document.querySelector("#searchInput");

    searchBtn.addEventListener("click", function () {
      const searchLow = searchInput.value.toLowerCase();

      const filteredMovies = data.data.filter((movie) =>
        movie.title.toLowerCase().includes(searchLow)
      );

      searchInput.value = "";

      if (filteredMovies.length === 0) {
        window.location.href = "notfound.html";
      }

      displayMovies(filteredMovies);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData("movies");
