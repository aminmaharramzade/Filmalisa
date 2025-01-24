const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = localStorage.getItem("accessToken");

function loadFavourites() {
  const favourites = JSON.parse(localStorage.getItem("favourites")) || [];
  const favouriteArea = document.querySelector("#favouriteArea");
  favouriteArea.innerHTML = "";

  favourites.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("favourite-card");

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
      <h4>${movie.category.name}</h4>
      <h1>${movie.title}</h1>
    `;

    favouriteArea.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadFavourites);
