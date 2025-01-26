const passwordEye = document.querySelector(`#passwordEye`);
const passwordInput = document.querySelector(`#passwordInput`);
const emailInput = document.querySelector(`#emailInput`);
const loginBtn = document.querySelector(`#loginBtn`);

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa";

// password private
passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// required login
loginBtn.addEventListener("click", async function (event) {
  event.preventDefault();
  if (emailInput.value === "") {
    emailInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value === "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
  if (emailInput.value !== "" && passwordInput.value !== "") {
    try {
      const response = await fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      const token = data.data.tokens.access_token;
      localStorage.setItem("accessToken", token);

      const usersResponse = await fetch(`${baseURL}/admin/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!usersResponse.ok) {
        throw new Error(`Error: ${usersResponse.status}`);
      }

      const usersData = await usersResponse.json();
      const user = usersData.data.find(
        (user) => user.email === emailInput.value
      );

      if (user) {
        window.location.href = "../pages/home.html";
      } else {
        emailInput.value = "";
        passwordInput.value = "";
        emailInput.setAttribute("placeholder", "Invalid email");
        passwordInput.setAttribute("placeholder", "Invalid password");
      }
    } catch (error) {
      console.error("Error:", error);
      emailInput.value = "";
      passwordInput.value = "";
      emailInput.setAttribute("placeholder", "Invalid email");
      passwordInput.setAttribute("placeholder", "Invalid password");
    }
  }
});
