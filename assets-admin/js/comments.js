const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";
const commentTableBody = document.querySelector(`.movie-table tbody`);

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
    console.log(data.data);
    data.data.forEach((item) => {
      addCommentsToTable(item);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function addCommentsToTable(comment) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${comment.id}</th>
    <td>${comment.comment}</td>
    <td>${comment.movie.title}</td>
    <td>
      <button class="btn btn-danger delete-btn" data-id="${comment.id}" data-movie-id="${comment.movie.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  commentTableBody.appendChild(row);

  row.querySelector(".delete-btn").addEventListener("click", async (event) => {
    const commentId = event.target.closest("button").dataset.id;
    const movieId = event.target.closest("button").dataset.movieId;
    await removeComment(movieId, commentId);
    row.remove();
  });
}

fetchData(`comments`);

// DELETE
async function removeComment(movieId, commentId) {
  try {
    const response = await fetch(
      `${baseURL}/movies/${movieId}/comment/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    console.log(`Comment ${commentId} deleted successfully`);
  } catch (error) {
    console.error("Error:", error);
  }
}
