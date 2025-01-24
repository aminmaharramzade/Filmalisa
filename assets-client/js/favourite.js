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

    data.data.forEach((movie) => {
      const card = document.createElement("div");
      card.classList.add("favourite-card");

      card.addEventListener("click", () => {
        window.location.href = `../pages/details.html?id=${movie.id}`;
      });
      const favouriteArea = document.querySelector("#favouriteArea");
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
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData("movies");
