const mainTimer = document.querySelector('.main-timer'),
  buttonStart = document.querySelector('.start'),
  buttonPause = document.querySelector('.pause'),
  buttonStop = document.querySelector('.stop'),
  buttonInterval = document.querySelector('.interval-button'),
  inervals = document.querySelector('.container-interval'),
  intervalTemplate = document.getElementById('interval-template').content.querySelector('.interval');

function isZeroNeed(num) {
  num = String(num);
  return num.length == 1 ? '0' + num : num;
}

class Timer {
  constructor(place, next, uppestValue) {
    this.place = place;
    this.next = next;
    this.uppestValue = uppestValue;
  }
  current = 0;
  updateText() {
    this.place.textContent = isZeroNeed(this.current);
  }
  reset() {
    this.current = 0;
  }
  update() {
    this.current++;
    if (this.current === this.uppestValue) {
      this.next?.update();
      this.reset();
    }
    this.updateText();
  }
}

const hours = new Timer(mainTimer.querySelector('.hours'), undefined, 99);
const minutes = new Timer(mainTimer.querySelector('.minutes'), hours, 60);
const seconds = new Timer(mainTimer.querySelector('.seconds'), minutes, 60);
const centiseconds = new Timer(mainTimer.querySelector('.miliseconds'), seconds, 100);
const fullTimer = [hours, minutes, seconds, centiseconds];

const update = centiseconds.update.bind(centiseconds);

let timerId;

const playTimer = () => {
  buttonInterval.removeAttribute('disabled');
  timerId = setInterval(update, 10);
};

const pauseTimer = () => {
  buttonInterval.setAttribute('disabled', true);
  clearInterval(timerId);
};

const resetTimer = () => {
  buttonInterval.setAttribute('disabled', true);
  clearInterval(timerId);
  fullTimer.forEach(item => {
    item.reset();
    item.updateText();
  });
};

const createInterval = () => {
  const newInterval = intervalTemplate.cloneNode(true);
  const text = newInterval.querySelector('.interval__text');
  const button = newInterval.querySelector('.interval__button-clear');
  text.textContent = `${countIntervals++}. ${isZeroNeed(hours.current)}:${isZeroNeed(minutes.current)}:${isZeroNeed(seconds.current)}:${isZeroNeed(centiseconds.current)}`;
  button.addEventListener('click', () => newInterval.remove());
  return newInterval;
};

let countIntervals = 1;

const addInterval = () => {
  inervals.prepend(createInterval());
};

buttonStart.addEventListener('click', playTimer);
buttonPause.addEventListener('click', pauseTimer);
buttonStop.addEventListener('click', resetTimer);
buttonInterval.addEventListener('click', addInterval);
