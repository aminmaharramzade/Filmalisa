const carouselInner = document.querySelector(".carousel-inner");
const dots = document.querySelectorAll(".dot");

let currentIndex = 0;

function updateCarousel(index) {
  const offset = -index * 100;
  carouselInner.style.transform = `translateX(${offset}%)`;

  dots.forEach((d) => d.classList.remove("active"));
  dots[index].classList.add("active");
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    currentIndex = parseInt(dot.getAttribute("data-index"));
    updateCarousel(currentIndex);
  });
});

function autoSlide() {
  currentIndex = (currentIndex + 1) % dots.length;
  updateCarousel(currentIndex);
}

setInterval(autoSlide, 5000);
