const logoutBtn = document.querySelector(`#logoutBtn`);

logoutBtn.addEventListener(`click`, function () {
  localStorage.removeItem(`accessToken`);
});

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NTc0OTIyLCJleHAiOjE3Njg2Nzg5MjJ9.xM7OU1oOOgk-SicNULAy_ogKRoNy1aiF3SBwVFokyyg`;

const actions = document.querySelector(`#actions`)
const movies = document.querySelector(`#movies`)
const users = document.querySelector(`#users`)
const categories = document.querySelector(`#categories`)
const comments = document.querySelector(`#comments`)
const actors = document.querySelector(`#actors`)
const contacts =  document.querySelector(`#contacts`)


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
    console.log(data);
    movies.textContent = data.data.movies
    categories.textContent = data.data.categories
    contacts.textContent = data.data.contacts
    comments.textContent = data.data.comments
    users.textContent = data.data.users
    actors.textContent = data.data.actors
    actions.textContent = data.data.favorites
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData("dashboard");
