const imgInput = document.querySelector(`#imgInput`);
const imgEye = document.querySelector(`#imgEye`);
const nameInput = document.querySelector(`#nameInput`);
const nameEye = document.querySelector(`#nameEye`);
const passwordInput = document.querySelector(`#passwordInput`);
const passwordEye = document.querySelector(`#passwordEye`);
const saveBtn = document.querySelector(`#saveBtn`);
const message = document.querySelector(`.message`);

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
  } else {
    message.style.display = "block";
    setTimeout(() => {
      location.reload();
    }, 2000);
  }
});
