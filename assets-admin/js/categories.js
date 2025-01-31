const categoryTableBody = document.querySelector('.movie-table tbody');
const submitButton = document.querySelector('.custom-btn');
const modal = document.querySelector('#exampleModal');
const pagination = document.querySelector('.pagination');
let currentPage = 1;
const rowsPerPage = 10;

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";

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
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data.data);
    displayCategories(data.data, categoryTableBody, rowsPerPage, currentPage);
    setupPagination(data.data, pagination, rowsPerPage);
  } catch (error) {
    console.error("Error:", error);
  }
}


function displayCategories(categories, wrapper, rowsPerPage, page) {
  wrapper.innerHTML = "";
  page--;

  const start = rowsPerPage * page;
  const end = start + rowsPerPage;
  const paginatedCategories = categories.slice(start, end);

  paginatedCategories.forEach(category => {
    addCategoryToTable(category);
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
  const button = document.createElement('button');
  button.innerText = page;
  button.style.backgroundColor = "#58209d";
  button.style.color = "#fff";
  button.style.border = "none";
  button.style.margin = "0 5px";
  button.style.padding = "5px 10px";
  button.style.borderRadius = "5px";

  if (currentPage == page) button.classList.add('active');

  button.addEventListener('click', function () {
    currentPage = page;
    displayCategories(items, categoryTableBody, rowsPerPage, currentPage);

    const currentBtn = document.querySelector('.pagination button.active');
    if (currentBtn) currentBtn.classList.remove('active');

    button.classList.add('active');
  });

  return button;
}

function addCategoryToTable(category) {
  const row = document.createElement('tr');
  row.setAttribute('data-id', category.id);
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

  row.querySelector('.edit-btn').addEventListener('click', () => {
    document.getElementById('editCategoryName').value = category.name; 
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();

    document.getElementById('confirmEditBtn').onclick = () => {
      editCategory(category.id); 
      editModal.hide();
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

// PUT
async function editCategory(categoryId) {
  const categoryName = document.getElementById('editCategoryName').value.trim();

  if (!categoryName) {
    showNotification("error", "Please enter a category name.");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/category/${categoryId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    showNotification("success", "Category updated successfully!");

    const row = document.querySelector(`tr[data-id="${categoryId}"]`);
    row.querySelector('td').textContent = categoryName;
  } catch (error) {
    showNotification("error", "Request Error: " + error.message);
  }
}

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