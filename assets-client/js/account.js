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

    imgInput.setAttribute("placeholder", account.img_url || "No image");
    nameInput.setAttribute("placeholder", account.full_name || "Full Name");
    emailInput.setAttribute("placeholder", account.email || "Email");
    accountImg.src = account.img_url || "default-image-url";
    imgInput.value = account.img_url || "";
    nameInput.value = account.full_name || "";
    emailInput.value = account.email || "";
    passwordInput.value = "";
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchAccountData(`profile`);

passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

saveBtn.addEventListener("click", async function () {
  const imgUrl = imgInput.value.trim();
  const fullName = nameInput.value.trim();
  const password = passwordInput.value.trim();
  const email = emailInput.value.trim();

  const body = {};

  if (fullName) body.full_name = fullName;
  if (imgUrl) body.img_url = imgUrl || null;
  if (password) body.password = password;
  if (email) body.email = email;

  if (!fullName && !imgUrl && !password) {
    message.textContent = "At least one field must be updated.";
    return;
  }

  try {
    const response = await fetch(`${baseURL}/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    message.textContent = "Profile updated successfully!";
    localStorage.setItem("fullName", fullName);

    imgInput.setAttribute("placeholder", imgUrl || "No image");
    nameInput.setAttribute("placeholder", fullName);
    passwordInput.setAttribute("placeholder", "********");

    accountImg.src = imgUrl || "default-image-url";

    saveBtn.style.backgroundColor = "green";
    message.style.display = "block";
    message.style.color = "#fff";
    message.style.fontFamily = "var(--numansFont)";

    setTimeout(() => {
      saveBtn.style.backgroundColor = "";
      message.style.display = "none";
    }, 1000);
  } catch (error) {
    message.style.display = "block";
    message.textContent = error.message;
    message.style.color = "#fff";
    message.style.backgroundColor = "red";
    passwordInput.style.borderColor = "red";
    message.style.fontFamily = "var(--numansFont)";

    setTimeout(() => {
      message.style.display = "none";
      passwordInput.style.borderColor = "";
    }, 2000);
  }
});
