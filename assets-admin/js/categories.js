const categoryTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.custom-btn');
const modal = document.querySelector('#exampleModal');

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";

// GET 
async function fetchData(endpoint) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    data.data.forEach(item => {
      addCategoryToTable(item);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

function addCategoryToTable(category) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <th scope="row">${category.id}</th>
    <td>${category.name}</td>
    <td>
      <button class="btn btn-primary edit-btn">
        <i class="fa-regular fa-pen-to-square"></i>
      </button>
      <button class="btn btn-danger delete-btn">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;
  categoryTableBody.appendChild(row);
}
// POST 
document.querySelector('.movies-form').addEventListener('submit', async (event) => {
  event.preventDefault(); 

  const categoryName = document.getElementById('title').value.trim(); 

  if (!categoryName) {
    alert("Please enter a category name.");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      const  data = await response.json();
      addCategoryToTable(data);
      alert("Category successfully added!");
    } else {
      alert(`Server Error: ${response.status}`);
    }
  } catch (error) {
    alert("Request Error: " + error.message);
  }

  
  document.getElementById('title').value = ''; 
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide(); 
});

fetchData('categories'); 