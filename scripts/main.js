//Отпишите пж, если проверите https://t.me/tumblr_19
const hideToggle = document.getElementById('hide-toggle');
const progressBar = document.querySelector('.progress__bar');
const progressCircle = document.querySelector('.progress_circle');
const spinCircle = document.querySelector('.spin-circle'); 
const input = document.getElementById('value-input');
const animateToggle = document.getElementById('animate-toggle');


let spinCircleResetTimeout = null;//таймеры
let spinCircleLoopTimeout = null;//таймеры

// забирает и валидирует значение из инпута
function getValueInput() {
  const raw = input.value.trim();

  if (raw === '') {
    return {
      raw,
      value: null,
      isValid: false,
      error: 'Введите число от 0 до 100',
      reason: 'empty'
    };
  }

  if (!/^\d+$/.test(raw)) {
    return {
      raw,
      value: null,
      isValid: false,
      error: 'Допустимы только цифры'
    };
  }

  const value = parseInt(raw, 10);
  if (value < 0 || value > 100) {
    return {
      raw,
      value,
      isValid: false,
      error: 'Число должно быть от 0 до 100'
    };
  }

  return {
    raw,
    value,
    isValid: true,
    error: ''
  };
}

// Прячет / показывает круг прогресса
hideToggle.addEventListener('change', () => {
  progressBlock.setHidden(hideToggle.checked);
});

// Чистит активные таймеры, чтобы не копились циклы
function clearSpinAnimationTimers() {
  clearTimeout(spinCircleResetTimeout);
  clearTimeout(spinCircleLoopTimeout);
  spinCircleResetTimeout = null;
  spinCircleLoopTimeout = null;
}

// Полностью останавливает анимацию и возвращает к нулю
function stopSpinAnimation() {
  clearSpinAnimationTimers();
  spinCircle.style.opacity = '0';
  spinCircle.style.transition = 'none';
  spinCircleToValue(0);
}

function startSpinAnimationLoop() {
  clearSpinAnimationTimers();

  const runCycle = () => {
    const { isValid, value } = getValueInput();

    if (!(animateToggle.checked && isValid)) {
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

// слушатель запускает / останавливает вращение
animateToggle.addEventListener('change', () => {
  if (!animateToggle.checked) {
    progressBlock.setAnimated(false);
    return;
  }

  const { isValid } = getValueInput();
  if (!isValid) {
    animateToggle.checked = false;
    progressBlock.setAnimated(false);
    return;
  }

  progressBlock.setAnimated(true);
});


const CIRCLE_LENGTH = 2 * Math.PI * 60;

// Переводит бегунок (spin-circle) на нужный угол в градусах
function spinCircleToValue(value) {
  const degrees = value === 0 ? 0 : 360 * (value / 100) - 18;
  spinCircle.style.transform = `rotate(${degrees}deg)`;
}




input.addEventListener('input', () => {
  const state = getValueInput();

  if (!state.isValid) {
    input.title = state.error;
    if (state.reason === 'empty') {
      input.classList.remove('invalid');
      progressCircle.style.strokeDasharray = CIRCLE_LENGTH;
      progressCircle.style.strokeDashoffset = CIRCLE_LENGTH;
      spinCircleToValue(0);
    } else {
      input.classList.add('invalid');
    }
    animateToggle.checked = false;
    progressBlock.setAnimated(false);
    return;
  }

  input.title = '';
  input.classList.remove('invalid');

  progressCircle.style.strokeDasharray = CIRCLE_LENGTH;
  const offset = CIRCLE_LENGTH * (1 - state.value / 100);
  progressCircle.style.strokeDashoffset = offset;
  spinCircleToValue(state.value);
});
//API методы
const progressBlock = {
  setValue(value) {
    input.value = value;
    input.dispatchEvent(new Event('input'));
  },
  setHidden(isHidden) {
    hideToggle.checked = isHidden;
    progressBar.classList.toggle('progress__bar--hidden', isHidden);
  },
  setAnimated(shouldAnimate) {
    if (shouldAnimate) {
      const { isValid } = getValueInput();
      if (!isValid) {
        animateToggle.checked = false;
        stopSpinAnimation();
        return;
      }
    }

    animateToggle.checked = shouldAnimate;
    if (shouldAnimate) {
      progressCircle.style.transition = 'stroke-dashoffset 0.6s ease-in-out';
      startSpinAnimationLoop();
    } else {
      progressCircle.style.transition = 'none';
      stopSpinAnimation();
    }
  },
  getState() {
    return {
      value: parseInt(input.value, 10) || 0,
      hidden: hideToggle.checked,
      animated: animateToggle.checked,
    };
  }
};

window.progressBlock = progressBlock;
