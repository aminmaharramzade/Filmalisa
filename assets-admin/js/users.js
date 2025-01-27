const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3OTI5NzcwLCJleHAiOjE3NjkwMzM3NzB9.J9Ytl3YcI3HhEGNVWep4iStTkMBYkd_jbHC3U1gSjmo";
const usersTableBody = document.querySelector(`.movie-table tbody`);
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
      addUsersToTable(item);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function addUsersToTable(user) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${user.id}</th>
    <td>${user.full_name}</td>
    <td>${user.email}</td>
    <td><img style="width: 30px ; height: 40px;object-fit: cover" src="${user.img_url}"></td>
  `;
  usersTableBody.appendChild(row);
}

fetchData(`users`);
