// Основные элементы управления
const hideToggle = document.getElementById('hide-toggle');
const progressBar = document.querySelector('.progress__bar');
const progressCircle = document.querySelector('.progress_circle');
const spinCircle = document.querySelector('.spin-circle'); 
const input = document.getElementById('value-input');
const animateToggle = document.getElementById('animate-toggle');

// Таймеры, контролирующие бесконечный цикл вращения
let spinCircleResetTimeout = null;
let spinCircleLoopTimeout = null;

// Возвращает исходную строку, признак валидности и ограниченное значение 0..100
function getValueInput() {
  const raw = input.value.trim();
  const correctValue = raw !== '' && !isNaN(raw);
  const value = correctValue ? Math.min(Math.max(parseInt(raw, 10) || 0, 0), 100) : 0;
  return { raw, correctValue, value };
}

// Прячет / показывает круг прогресса
hideToggle.addEventListener('change', () => {
  progressBar.classList.toggle('progress__bar--hidden', hideToggle.checked);
});

// Чистит активные таймеры, чтобы не копились параллельные циклы
function clearSpinAnimationTimers() {
  clearTimeout(spinCircleResetTimeout);
  clearTimeout(spinCircleLoopTimeout);
  spinCircleResetTimeout = null;
  spinCircleLoopTimeout = null;
}

// Полностью останавливает анимацию и возвращает указатель в ноль
function stopSpinAnimation() {
  clearSpinAnimationTimers();
  spinCircle.style.opacity = '0';
  spinCircle.style.transition = 'none';
  spinCircleToValue(0);
}

// Запускает повторяющийся цикл: сброс → плавное вращение → повтор
function startSpinAnimationLoop() {
  clearSpinAnimationTimers();

  const runCycle = () => {
    const { correctValue, value } = getValueInput();

    if (!(animateToggle.checked && correctValue)) {
      stopSpinAnimation();
      return;
    }

    spinCircle.style.transition = 'none';
    spinCircleToValue(0);

    spinCircleResetTimeout = setTimeout(() => {
      spinCircle.style.transition = 'transform 1.0s linear';
      spinCircleToValue(value);
      spinCircleLoopTimeout = setTimeout(runCycle, 1100);
    }, 50);
  };

  spinCircle.style.opacity = '1';
  runCycle();
}

// слушатель Animate и запускает / останавливает вращение
animateToggle.addEventListener('change', () => {
  const { correctValue } = getValueInput();

  if (animateToggle.checked && correctValue) {
    progressCircle.style.transition = 'stroke-dashoffset 0.6s ease-in-out';
    startSpinAnimationLoop();
  } else {
    progressCircle.style.transition = 'none';
    stopSpinAnimation();
  }
});



spinCircle.style.animationPlayState = 'paused';
spinCircle.style.opacity = '0';

const CIRCLE_LENGTH = 2 * Math.PI * 60;

// Переводит указатель на нужный угол в градусах
function spinCircleToValue(value) {
  const degrees = value === 0 ? 0 : 360 * (value / 100) - 18;
  spinCircle.style.transform = `rotate(${degrees}deg)`;
}



// Валидация поля + обновление круга и указателя
input.addEventListener('input', () => {
  const { raw } = getValueInput();

  if (raw === '') {
    input.title = 'Введите число от 0 до 100';
    input.classList.remove('invalid');
    progressCircle.style.strokeDashoffset = CIRCLE_LENGTH;
    progressCircle.style.strokeDasharray = CIRCLE_LENGTH; 
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

  progressCircle.style.strokeDasharray = CIRCLE_LENGTH;
  const offset = CIRCLE_LENGTH * (1 - value / 100);
  progressCircle.style.strokeDashoffset = offset;
  spinCircleToValue(value);
});
