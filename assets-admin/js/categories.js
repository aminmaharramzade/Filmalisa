const categoryTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.custom-btn');
const modal = document.querySelector('#exampleModal');

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";

function showNotification(type, message) {
  toastr.options = {


    positionClass: "toast-top-right",
    timeOut: 3000, // Bildirişin ekranda qalma müddəti (ms ilə)
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
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    const sortData = data.data.sort((a, b) => a.id - b.id);
    sortData.forEach(item => {
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

  row.querySelector('.delete-btn').addEventListener('click', () => {
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmationModal'));
    deleteModal.show();

    document.getElementById('confirmDeleteBtn').onclick = () => {
      deleteCategory(category.id);
      deleteModal.hide();
    };
  });
}
// POST 
document.querySelector('.movies-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const categoryName = document.getElementById('title').value.trim();

  if (!categoryName) {
    showNotification("error", "Please enter a category name!");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/category`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      const data = await response.json();
      addCategoryToTable(data.data);
      showNotification("success", "Category successfully added!");
    } else {
      showNotification("error", "Error: " + response.status);
    }
  } catch (error) {
    showNotification("error", error.message);
  }


  document.getElementById('title').value = '';
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();
});

// DELETE
async function deleteCategory(categoryId) {
  try {
    const response = await fetch(`${baseURL}/category/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    showNotification("success", "Category successfully deleted!");
    document.querySelector(`tr[data-id="${categoryId}"]`).remove();
  } catch (error) {
    showNotification("error", "Error: " + error.message);
  }
}

fetchData('categories'); 