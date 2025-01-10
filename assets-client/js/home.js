const actionCardArea = document.querySelector(".action-card-area");
let isDown = false;
let startX;
let scrollLeft;

actionCardArea.addEventListener("mousedown", (e) => {
  isDown = true;
  actionCardArea.classList.add("active");
  startX = e.pageX - actionCardArea.offsetLeft;
  scrollLeft = actionCardArea.scrollLeft;
});

actionCardArea.addEventListener("mouseleave", () => {
  isDown = false;
  actionCardArea.classList.remove("active");
});

actionCardArea.addEventListener("mouseup", () => {
  isDown = false;
  actionCardArea.classList.remove("active");
});

actionCardArea.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - actionCardArea.offsetLeft;
  const walk = (x - startX) * 3; 
  actionCardArea.scrollLeft = scrollLeft - walk;
});

actionCardArea.style.scrollBehavior = "smooth";
