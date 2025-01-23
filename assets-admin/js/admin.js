const passwordEye = document.querySelector(`#passwordEye`);
const passwordInput = document.querySelector(`#inputPassword`);
const nameInput = document.querySelector(`#inputName`);
const loginBtn = document.querySelector(`#loginBtn`);

// Toggle password visibility
passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// Required login validation
loginBtn.addEventListener("click", function () {
  if (nameInput.value === "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value === "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
  if (nameInput.value !== "" && passwordInput.value !== "") {
    fetchData("login", nameInput.value, passwordInput.value);
  }
});

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin";

async function fetchData(endpoint, email, password) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();

    if (nameInput.value === email && passwordInput.value === password) {
      const accessToken = data.data.tokens.access_token;
      localStorage.setItem("accessToken", accessToken);
      window.location.href = "assets-admin/pages/dashboard.html";
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
