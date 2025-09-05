
const boxes = document.querySelectorAll('.icon-box');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

let currentIndex = 0;

// প্রথম বক্স দেখানো
boxes.forEach((box, i) => {
  if(i === currentIndex) box.classList.add('show');
  else box.classList.add('hide-up');
});

function showBox(nextIndex) {
  if(nextIndex === currentIndex) return;

  const currentBox = boxes[currentIndex];
  const nextBox = boxes[nextIndex];

  currentBox.classList.remove('show');
  currentBox.classList.add('hide-up');

  nextBox.classList.remove('hide-up');
  nextBox.classList.add('show');

  currentIndex = nextIndex;
}

leftBtn.addEventListener('click', () => {
  let nextIndex = (currentIndex - 1 + boxes.length) % boxes.length;
  showBox(nextIndex);
});

rightBtn.addEventListener('click', () => {
  let nextIndex = (currentIndex + 1) % boxes.length;
  showBox(nextIndex);
});