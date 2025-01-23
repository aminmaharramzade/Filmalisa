const categoryTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.custom-btn');
const modal = document.querySelector('#exampleModal');

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NjE4MzExLCJleHAiOjE3Njg3MjIzMTF9.D764-UeEH-tpz_lCtnPXi2ZcaydOOjh16-4SchtnFX4";
let editMode = false;
let editRow = null;

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

  // Add event listener to the delete button
  row.querySelector('.delete-btn').addEventListener('click', function() {
    row.remove();
  });

  // Add event listener to the edit button
  row.querySelector('.edit-btn').addEventListener('click', function() {
    editMode = true;
    editRow = row;
    document.querySelector('#title').value = category.name;
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
  });
}

submitButton.addEventListener('click', function(event) {
  event.preventDefault();
  
  const name = document.querySelector('#title').value;
  
  if (editMode) {
    editRow.querySelector('td:nth-child(2)').textContent = name;
    editMode = false;
    editRow = null;
  } else {
    const newCategory = {
      id: categoryTableBody.children.length + 1,
      name: name
    };
    addCategoryToTable(newCategory);
  }

  const modalInstance = bootstrap.Modal.getInstance(modal);
  modalInstance.hide();

  // Reset the modal values
  document.querySelector('#title').value = '';
});

// fetchData('categories'); // Commented out to prevent initial display