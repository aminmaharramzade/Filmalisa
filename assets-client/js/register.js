const passwordEye = document.querySelector(`#passwordEye`);
const nameEye = document.querySelector(`#nameEye`)
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

// required login
registerBtn.addEventListener("click", function () {
  if (nameInput.value === "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (emailInput.value === "") {
    emailInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value === "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
  if (nameInput.value !== "" && emailInput.value !== "" && passwordInput.value !== "") {
    window.location.href = "../../index.html";
  }
});
