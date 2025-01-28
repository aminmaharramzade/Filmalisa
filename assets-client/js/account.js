const imgInput = document.querySelector(`#imgInput`);
const nameInput = document.querySelector(`#nameInput`);
const passwordInput = document.querySelector(`#passwordInput`);
const passwordEye = document.querySelector(`#passwordEye`);
const saveBtn = document.querySelector(`#saveBtn`);
const message = document.querySelector(`.message`);
const emailInput = document.querySelector(`#emailInput`);
const accountImg = document.querySelector(`#accountImg`);

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
    accountImg.src = account.img_url;
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchAccountData(`profile`);

// password private
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

saveBtn.addEventListener("click", async function () {
  const imgUrl = imgInput.value.trim();
  const fullName = nameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!imgUrl || !fullName || !password) {
    if (!imgUrl) imgInput.setAttribute("placeholder", "Required");
    if (!fullName) nameInput.setAttribute("placeholder", "Required");
    if (!password) passwordInput.setAttribute("placeholder", "Required");
    return;
  }

  try {
    const response = await fetch(`${baseURL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imgUrl, fullName, password }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    message.textContent = "Profile updated successfully!";
    localStorage.setItem("fullName", fullName);

    imgInput.setAttribute("placeholder", imgUrl);
    nameInput.setAttribute("placeholder", fullName);
    accountImg.src = imgUrl;


  } catch (error) {
    console.error("Error:", error);
    message.textContent = "Failed to update profile.";
  }
});
