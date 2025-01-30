const accordionAnswers = document.getElementsByClassName(`accordion-answer`);
const plusBtns = document.querySelectorAll(`#plusBtn`);

plusBtns.forEach((btn, index) => {
  btn.addEventListener(`click`, function () {
    if (accordionAnswers[index].style.display === "block") {
      accordionAnswers[index].style.display = "none";
    } else {
      accordionAnswers[index].style.display = "block";
    }
  });
});

const emailInput = document.querySelector(`#emailInput`);
const nameInput = document.querySelector(`#nameInput`);
const reasonInput = document.querySelector(`#reasonInput`);
const submitBtn = document.querySelector("#submitBtn");

const baseURL = "https://api.sarkhanrahimli.dev/api/filmalisa";
// POST
async function postData(endpoint, name, email, reason) {
  try {
    const response = await fetch(`${baseURL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: name,
        email: email,
        reason: reason,
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

submitBtn.addEventListener("click", (event) => {
  if (nameInput.value === "") {
    nameInput.setAttribute("placeholder", "Required");
  }
  if (emailInput.value === "") {
    emailInput.setAttribute("placeholder", "Required");
  }
  if (reasonInput.value === "") {
    reasonInput.setAttribute("placeholder", "Required");
  }
  if (
    !nameInput.value == "" &&
    !emailInput.value == "" &&
    !reasonInput.value == ""
  ) {
    submitBtn.style.backgroundColor = "rgba(13, 136, 13, 0.542)";
    event.preventDefault();
    postData("contact", nameInput.value, emailInput.value, reasonInput.value);
  }

  nameInput.value = "";
  emailInput.value = "";
  reasonInput.value = "";
});

if (localStorage.getItem("accessToken")) {
  const headerBtn = document.querySelector(`.header-btn`);
  const headerBtnLink = document.querySelector(`.header-btn a`);

  headerBtnLink.textContent = "Home";
  headerBtnLink.href = "./assets-client/pages/home.html";
  headerBtnLink.style.padding = "12px";
  headerBtnLink.style.fontFamily = "var(--numansFont)";

  headerBtn.addEventListener(`click`, function () {
    window.location.href = "./assets-client/pages/home.html";
  });
}
