const passwordEye = document.querySelector(`#passwordEye`);
const passwordInput = document.querySelector(`#inputPassword`);
const nameInput = document.querySelector(`#inputName`);
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
  if (nameInput.value === "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (passwordInput.value === "") {
    passwordInput.setAttribute("placeholder", "Required");
  }
  if (nameInput.value !== "" && passwordInput.value !== "") {
    window.location.href = "../assets-admin/pages/dashboard.html";
  }
});

const url = "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login";

const options = {
  method: "POST",  
  headers: {
    "Content-Type":"application/json"
  }
};

const myPromise = fetch(url, options);

myPromise
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('There was a problem with the fetch operation:', error);
  });

