const hideToggle = document.getElementById('hide-toggle');
const progressCircle = document.querySelector('.progress__circle');

const arc = document.querySelector('.progress__arc');
const knobRot = document.querySelector('.knob-rot'); 
const input = document.getElementById('value-input');
const animateToggle = document.getElementById('animate-toggle');


hideToggle.addEventListener('change', () => {
  progressCircle.classList.toggle('progress__circle--hidden', hideToggle.checked);
});


animateToggle.addEventListener('change', () => {

  function loop() {
    const raw = input.value.trim();
    const correctValue = raw !== '' && !isNaN(raw);
    const value = Math.min(Math.max(parseInt(raw, 10) || 0, 0), 100);

    if (!(animateToggle.checked && correctValue)) return;

    knobRot.style.transition = 'none';
    rotateKnobToValue(0);

    setTimeout(() => {
      knobRot.style.transition = 'transform 1.0s linear';
      rotateKnobToValue(value);
    }, 50);

    setTimeout(loop, 1100);
  }

  const strokaInput = input.value.trim();
  const correctValue = strokaInput !== '' && !isNaN(strokaInput);
  if (animateToggle.checked && correctValue) {
    arc.style.transition = 'stroke-dashoffset 0.6s ease-in-out';
    knobRot.style.opacity = '1';
    loop();
  } else {
    arc.style.transition = 'none';
    knobRot.style.opacity = '0';
    rotateKnobToValue(0);
  }
});


knobRot.style.animationPlayState = 'paused';
knobRot.style.opacity = '0';

const CIRCLE_LENGTH = 2 * Math.PI * 60;

function rotateKnobToValue(value) {
const degrees = value === 0 ? 0 : 360 * (value / 100) - 18;

  knobRot.style.transform = `rotate(${degrees}deg)`;
}



input.addEventListener('input', () => {
  const raw = input.value.trim();

  if (raw === '') {
    input.title = 'Введите число от 0 до 100';
    input.classList.remove('invalid');
    arc.style.strokeDashoffset = CIRCLE_LENGTH;
    arc.style.strokeDasharray = CIRCLE_LENGTH; 
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

  arc.style.strokeDasharray = CIRCLE_LENGTH;
  const offset = CIRCLE_LENGTH * (1 - value / 100);
  arc.style.strokeDashoffset = offset;
  rotateKnobToValue(value);
});
