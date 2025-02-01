const actorTableBody = document.querySelector(".movie-table tbody");
const submitButton = document.querySelector(".custom-btn");
const modal = document.querySelector("#exampleModal");
const pagination = document.querySelector(".pagination");
let currentPage = 1;
const rowsPerPage = 7;

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";

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
    const actorTableBody = document.querySelector(".movie-table tbody");
    const submitButton = document.querySelector(".custom-btn");
    const modal = document.querySelector("#exampleModal");
    const pagination = document.querySelector(".pagination");
    let currentPage = 1;
    const rowsPerPage = 7;

    const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
    const token = localStorage.getItem(`accessToken`);

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

    // GET
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
        const sortedData = data.data.sort((a, b) => b.id - a.id);
        displayActors(sortedData, actorTableBody, rowsPerPage, currentPage);
        setupPagination(sortedData, pagination, rowsPerPage);
      } catch (error) {
        console.error("Error:", error);
      }
    }

    function displayActors(actors, wrapper, rowsPerPage, page) {
      wrapper.innerHTML = "";
      page--;

      const start = rowsPerPage * page;
      const end = start + rowsPerPage;
      const paginatedActors = actors.slice(start, end);

      paginatedActors.forEach((actor) => {
        addActorToTable(actor);
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
        displayActors(items, actorTableBody, rowsPerPage, currentPage);

        const currentBtn = document.querySelector(".pagination button.active");
        if (currentBtn) currentBtn.classList.remove("active");

        button.classList.add("active");
      });

      return button;
    }

    function addActorToTable(actor) {
      const row = document.createElement("tr");
      row.setAttribute("data-id", actor.id);
      row.innerHTML = `
        <th scope="row">${actor.id}</th>
        <td>${actor.name} </td>
         <td>${actor.surname} </td>
        <td><img style="width: 50px ; height: 50px; object-fit: cover" src="${actor.img_url}" alt="Actor Image"></td>
        <td>
          <button class="btn btn-primary edit-btn">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      actorTableBody.appendChild(row);
    }

    // POST
    document
      .querySelector(".actors-form")
      .addEventListener("submit", async (event) => {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const surname = document.getElementById("surname").value.trim();
        const img_url = document.getElementById("img_url").value.trim();

        try {
          const response = await fetch(`${baseURL}/actor`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, surname, img_url }),
          });

          if (response.ok) {
            const data = await response.json();
            addActorToTable(data.data);
            showNotification("success", "Actor successfully added!");

            // Formu sıfırla
            document.getElementById("name").value = "";
            document.getElementById("surname").value = "";
            document.getElementById("img_url").value = "";

            // Modalı bağla
            const modal = bootstrap.Modal.getInstance(
              document.getElementById("exampleModal")
            );
            modal.hide();
          } else {
            showNotification("error", "Error: " + response.status);
          }
        } catch (error) {
          showNotification("error", error.message);
        }
      });

    // PUT (Update Actor)
    document.addEventListener("click", async (event) => {
      if (event.target.closest(".edit-btn")) {
        const row = event.target.closest("tr");
        const id = row.getAttribute("data-id");

        document.getElementById("editActorName").value =
          row.children[1].textContent.trim();
        document.getElementById("editActorSurname").value =
          row.children[2].textContent.trim();
        document.getElementById("editActorImgUrl").value =
          row.children[3].querySelector("img").src;

        document.getElementById("saveEditActorBtn").setAttribute("data-id", id);
        new bootstrap.Modal(document.getElementById("editActorModal")).show();
      }
    });

    document
      .getElementById("saveEditActorBtn")
      .addEventListener("click", async () => {
        const id = document
          .getElementById("saveEditActorBtn")
          .getAttribute("data-id");
        const name = document.getElementById("editActorName").value.trim();
        const surname = document
          .getElementById("editActorSurname")
          .value.trim();
        const img_url = document.getElementById("editActorImgUrl").value.trim();

        try {
          const response = await fetch(`${baseURL}/actor/${id}`, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, surname, img_url }),
          });

          if (response.ok) {
            toastr.success("Actor successfully updated!");
            new bootstrap.Modal(
              document.getElementById("editActorModal")
            ).hide();
            fetchData("actors");
          } else {
            toastr.error("Error: " + response.status);
          }
        } catch (error) {
          toastr.error(error.message);
        }
      });

    // DELETE (Remove Actor)
    document.addEventListener("click", async (event) => {
      if (event.target.closest(".delete-btn")) {
        const row = event.target.closest("tr");
        const id = row.getAttribute("data-id");

        const deleteModal = new bootstrap.Modal(
          document.getElementById("deleteConfirmationModal")
        );
        deleteModal.show();

        document.getElementById("confirmDeleteBtn").onclick = async () => {
          try {
            const response = await fetch(`${baseURL}/actor/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              toastr.success("Actor successfully deleted!");
              fetchData("actors");
            } else {
              toastr.error("Error: " + response.status);
            }
          } catch (error) {
            toastr.error(error.message);
          }
          deleteModal.hide();
        };
      }
    });

    fetchData("actors");
  } else if (type === "warning") {
    toastr.warning(message);
  }
}

// GET
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
    const sortedData = data.data.sort((a, b) => b.id - a.id);
    displayActors(sortedData, actorTableBody, rowsPerPage, currentPage);
    setupPagination(sortedData, pagination, rowsPerPage);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayActors(actors, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedActors = actors.slice(start, end);

  paginatedActors.forEach((actor) => {
    addActorToTable(actor);
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
    displayActors(items, actorTableBody, rowsPerPage, currentPage);

    const currentBtn = document.querySelector(".pagination button.active");
    if (currentBtn) currentBtn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
}

function addActorToTable(actor) {
  const row = document.createElement("tr");
  row.setAttribute("data-id", actor.id);
  row.innerHTML = `
    <th scope="row">${actor.id}</th>
    <td>${actor.name} </td>
     <td>${actor.surname} </td>
    <td><img style="width: 50px ; height: 50px; object-fit: cover" src="${actor.img_url}" alt="Actor Image"></td>
    <td>
      <button class="btn btn-primary edit-btn">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button class="btn btn-danger delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  actorTableBody.appendChild(row);
}

// POST
document
  .querySelector(".actors-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const img_url = document.getElementById("img_url").value.trim();

    try {
      const response = await fetch(`${baseURL}/actor`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, img_url }),
      });

      if (response.ok) {
        const data = await response.json();
        addActorToTable(data.data);
        showNotification("success", "Actor successfully added!");

        // Formu sıfırla
        document.getElementById("name").value = "";
        document.getElementById("surname").value = "";
        document.getElementById("img_url").value = "";

        // Modalı bağla
        const modal = bootstrap.Modal.getInstance(
          document.getElementById("exampleModal")
        );
        modal.hide();
      } else {
        showNotification("error", "Error: " + response.status);
      }
    } catch (error) {
      showNotification("error", error.message);
    }
  });

// PUT (Update Actor)
document.addEventListener("click", async (event) => {
  if (event.target.closest(".edit-btn")) {
    const row = event.target.closest("tr");
    const id = row.getAttribute("data-id");

    document.getElementById("editActorName").value =
      row.children[1].textContent.trim();
    document.getElementById("editActorSurname").value =
      row.children[2].textContent.trim();
    document.getElementById("editActorImgUrl").value =
      row.children[3].querySelector("img").src;

    document.getElementById("saveEditActorBtn").setAttribute("data-id", id);
    new bootstrap.Modal(document.getElementById("editActorModal")).show();
  }
});

document
  .getElementById("saveEditActorBtn")
  .addEventListener("click", async () => {
    const id = document
      .getElementById("saveEditActorBtn")
      .getAttribute("data-id");
    const name = document.getElementById("editActorName").value.trim();
    const surname = document.getElementById("editActorSurname").value.trim();
    const img_url = document.getElementById("editActorImgUrl").value.trim();

    try {
      const response = await fetch(`${baseURL}/actor/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, surname, img_url }),
      });

      if (response.ok) {
        toastr.success("Actor successfully updated!");
        new bootstrap.Modal(document.getElementById("editActorModal")).hide();
        fetchData("actors");
      } else {
        toastr.error("Error: " + response.status);
      }
    } catch (error) {
      toastr.error(error.message);
    }
  });

// DELETE (Remove Actor)
document.addEventListener("click", async (event) => {
  if (event.target.closest(".delete-btn")) {
    const row = event.target.closest("tr");
    const id = row.getAttribute("data-id");

    const deleteModal = new bootstrap.Modal(
      document.getElementById("deleteConfirmationModal")
    );
    deleteModal.show();

    document.getElementById("confirmDeleteBtn").onclick = async () => {
      try {
        const response = await fetch(`${baseURL}/actor/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          toastr.success("Actor successfully deleted!");
          fetchData("actors");
        } else {
          toastr.error("Error: " + response.status);
        }
      } catch (error) {
        toastr.error(error.message);
      }
      deleteModal.hide();
    };
  }
});

fetchData("actors");
