const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";
const contactTableBody = document.querySelector(`.movie-table tbody`);
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
      addContactsToTable(item);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function addContactsToTable(contact) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${contact.id}</th>
    <td>${contact.full_name}</td>
    <td>${contact.email}</td>
    <td>${contact.reason}</td>
    <td>
      <button class="btn btn-danger delete-btn" data-id="${contact.id}">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  contactTableBody.appendChild(row);

  row.querySelector(".delete-btn").addEventListener("click", async (event) => {
    const contactId = event.target.closest("button").dataset.id;
    await removeContact(contactId);
    row.remove();
  });
}

fetchData(`contacts`);

//delete
async function removeContact(id) {
  try {
    const response = await fetch(`${baseURL}/contact/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    console.log(`Contact ${id} deleted successfully`);
  } catch (error) {
    console.error("Error:", error);
  }
}
