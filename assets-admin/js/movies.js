const category = document.querySelector(`#category`);

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = localStorage.getItem('accessToken');

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
      const option = document.createElement('option');
      option.textContent = item.name;
      category.appendChild(option);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData(`categories`)
