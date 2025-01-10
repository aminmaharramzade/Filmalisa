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
