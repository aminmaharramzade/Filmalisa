const passwordEye = document.querySelector(`#passwordEye`);
const nameEye = document.querySelector(`#nameEye`);
const passwordInput = document.querySelector(`#passwordInput`);
const emailInput = document.querySelector(`#emailInput`);
const nameInput = document.querySelector(`#nameInput`);
const registerBtn = document.querySelector(`#registerBtn`);

// password private
passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

//fullname private
nameEye.addEventListener("click", function () {
  if (nameInput.type === "text") {
    nameInput.type = "password";
  } else {
    nameInput.type = "text";
  }
});

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa/auth";
// POST
async function postData(endpoint, password, name, email) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: password,
        full_name: name,
        email: email,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

registerBtn.addEventListener("click", (event) => {
  if (nameInput.value === "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (emailInput.value === "") {
    emailInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value === "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
  if (
    !nameInput.value == "" &&
    !emailInput.value == "" &&
    !passwordInput.value == ""
  ) {
    registerBtn.style.backgroundColor = "rgba(13, 136, 13, 0.542)";
    setTimeout(() => {
      window.location.href = "../pages/login.html";
    }, 2000);

    event.preventDefault();
    postData("signup", passwordInput.value, nameInput.value, emailInput.value);
  }

  nameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
});
