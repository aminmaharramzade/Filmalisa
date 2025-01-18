const passwordEye = document.querySelector(`#passwordEye`);
const passwordInput = document.querySelector(`#passwordInput`);
const emailInput = document.querySelector(`#emailInput`);
const loginBtn = document.querySelector(`#loginBtn`);

// password private
passwordEye.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
});

// required login
loginBtn.addEventListener("click", function () {
  if (passwordInput.value == "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
  if (emailInput.value == "") {
    emailInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value == "" || emailInput.value == "") {
    emailInput.setAttribute("placeholder", "Required");
    passwordInput.setAttribute("placeholder", "Required");
  } else {
    window.location.href = "../../index.html";
  }
});
