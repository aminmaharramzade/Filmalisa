const bgSlider = document.querySelector('#bgSlider');
const dotOne = document.querySelector('#dotOne');
const dotTwo = document.querySelector('#dotTwo');
const dotThree = document.querySelector('#dotThree');

const images = [
  '../assets/images/home-bg.svg',
  '../assets/images/home-bg.svg', 
  '../assets/images/home-bg.svg'  
];

let currentIndex = 0;

const updateBackgroundImage = (index) => {
  bgSlider.style.backgroundImage = `linear-gradient(to left, #1d1d1d00, #1d1d1dcc), url(${images[index]})`;
  dotOne.src = index === 0 ? '../assets/icons/active-dot-icon.svg' : '../assets/icons/deactive-dot-icon.svg';
  dotTwo.src = index === 1 ? '../assets/icons/active-dot-icon.svg' : '../assets/icons/deactive-dot-icon.svg';
  dotThree.src = index === 2 ? '../assets/icons/active-dot-icon.svg' : '../assets/icons/deactive-dot-icon.svg';
};

dotOne.addEventListener('click', () => {
  currentIndex = 0;
  updateBackgroundImage(currentIndex);
});

dotTwo.addEventListener('click', () => {
  currentIndex = 1;
  updateBackgroundImage(currentIndex);
});

dotThree.addEventListener('click', () => {
  currentIndex = 2;
  updateBackgroundImage(currentIndex);
});

updateBackgroundImage(currentIndex);

setInterval(() => {
  currentIndex = (currentIndex + 1) % images.length;
  updateBackgroundImage(currentIndex);
}, 5000);