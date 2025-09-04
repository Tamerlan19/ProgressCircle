const hideToggle = document.getElementById('hide-toggle');
const progressCircle = document.querySelector('.progress__circle');

const arc = document.querySelector('.progress__arc');
const input = document.getElementById('value-input');

const animateToggle = document.getElementById('animate-toggle');


hideToggle.addEventListener('change', () => {
  progressCircle.classList.toggle('progress__circle--hidden', hideToggle.checked);
});


animateToggle.addEventListener('change', () => {
  if (animateToggle.checked) {
    arc.style.transition = 'stroke-dashoffset 0.6s ease-in-out';
  } else {
    arc.style.transition = 'none';
  }
});



const CIRCLE_LENGTH = 2 * Math.PI * 60;

input.addEventListener('input', () => {
  const raw = input.value.trim();

  if (raw === '') {
    input.title = 'Введите число от 0 до 100';
    input.classList.remove('invalid');
    arc.style.strokeDashoffset = CIRCLE_LENGTH;
    return;
  }

  if (!/^\d+$/.test(raw)) {
    input.title = 'Допустимы только цифры';
    input.classList.add('invalid');
    return;
  }

  let value = parseInt(raw, 10);
  if (value < 0 || value > 100) {
    input.title = 'Число должно быть от 0 до 100';
    input.classList.add('invalid');
    return;
  }

  input.classList.remove('invalid');

  const offset = CIRCLE_LENGTH * (1 - value / 100);
  arc.style.strokeDashoffset = offset;
});
