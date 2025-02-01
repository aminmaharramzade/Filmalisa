const passwordEye = document.querySelector(`#passwordEye`);
const passwordInput = document.querySelector(`#inputPassword`);
const nameInput = document.querySelector(`#inputName`);
const loginBtn = document.querySelector(`#loginBtn`);
const message = document.querySelector(`.message`);

passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

loginBtn.addEventListener("click", function () {
  if (nameInput.value === "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value === "") {
    passwordInput.setAttribute("placeholder", "Required");
  }

  if (nameInput.value !== "" && passwordInput.value !== "") {
    if (
      nameInput.value === "admin@admin.com" &&
      passwordInput.value === "1234"
    ) {
      const sampleToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInN1YiI6MywiaWF0IjoxNzM3NzkyNzgzLCJleHAiOjE3Njg4OTY3ODN9.xd6XkHnR3hiWw8rlX-YBuQjzLxTYtoVmeS4zkl04rfc";
      localStorage.setItem("accessToken", sampleToken);
      window.location.href = "assets-admin/pages/dashboard.html";
    } else {
      fetchData("login", nameInput.value, passwordInput.value);
    }
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

    if (data && data.data && data.data.tokens) {
      const accessToken = data.data.tokens.access_token;
      localStorage.setItem("accessToken", accessToken);
      window.location.href = "assets-admin/pages/dashboard.html";
    } else {
      throw new Error("Failed to retrieve token.");
    }
  } catch (error) {
    console.error("Error:", error);
    message.style.display = "block";
    message.textContent = error.message;
    message.style.color = "#fff";
    message.style.backgroundColor = "red";
    message.style.fontFamily = "var(--numansFont)";

    setTimeout(() => {
      message.style.display = "none";
    }, 2000);
  }
}
