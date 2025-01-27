const imgInput = document.querySelector(`#imgInput`);
const imgEye = document.querySelector(`#imgEye`);
const nameInput = document.querySelector(`#nameInput`);
const nameEye = document.querySelector(`#nameEye`);
const passwordInput = document.querySelector(`#passwordInput`);
const passwordEye = document.querySelector(`#passwordEye`);
const saveBtn = document.querySelector(`#saveBtn`);
const message = document.querySelector(`.message`);
const emailInput = document.querySelector(`#emailInput`);

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa";
const token = localStorage.getItem("accessToken");

// Fetch account data
async function fetchAccountData(endpoint) {
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
    const account = data.data;

    imgInput.setAttribute("placeholder", account.img_url);
    nameInput.setAttribute("placeholder", account.full_name);
    emailInput.setAttribute("placeholder", account.email);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchAccountData(`profile`);

// password private
imgEye.addEventListener("click", function () {
  if (imgInput.type === "text") {
    imgInput.type = "password";
  } else {
    imgInput.type = "text";
  }
});

nameEye.addEventListener("click", function () {
  if (nameInput.type === "text") {
    nameInput.type = "password";
  } else {
    nameInput.type = "text";
  }
});

passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// required input and save btn
saveBtn.addEventListener("click", function () {
  if (imgInput.value == "") {
    imgInput.setAttribute("placeholder", "Required");
  }
  if (nameInput.value == "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value == "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
});
