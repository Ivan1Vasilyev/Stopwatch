function isZeroNeed(num) {
  return String(num).length == 1 ? '0' + num : num;
}
const intervalTemplate = document.getElementById('interval-template').content.querySelector('.interval'),
  timerTemplate = document.getElementById('timer-template').content.querySelector('.main-container'); //глобальная
class Timer {
  constructor(place, next, uppestValue, isCentiseconds) {
    this.place = place;
    this.next = next;
    this.uppestValue = uppestValue;
    this.isCentiseconds = isCentiseconds;
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
    if (!this.isCentiseconds) {
      this.updateText();
    } else if (this.current % 5 === 0) {
      this.updateText();
    }
  }
}
const mainTimer = document.querySelector('.main-timer'), //в класс
  buttonStart = document.querySelector('.start'),
  buttonPause = document.querySelector('.pause'),
  buttonAddTimer = document.querySelector('.add'),
  intervals = document.querySelector('.container-interval');

let timerId;
let countIntervals = 1;

const hours = new Timer(mainTimer.querySelector('.hours'), undefined, 99);
const minutes = new Timer(mainTimer.querySelector('.minutes'), hours, 60);
const seconds = new Timer(mainTimer.querySelector('.seconds'), minutes, 60);
const centiseconds = new Timer(mainTimer.querySelector('.miliseconds'), seconds, 100, true);
const allTimers = [hours, minutes, seconds, centiseconds];

const update = centiseconds.update.bind(centiseconds);

const createTextInterval = place => {
  place.textContent = `${countIntervals++}) ${isZeroNeed(hours.current)}
  :${isZeroNeed(minutes.current)}:${isZeroNeed(seconds.current)}:${isZeroNeed(centiseconds.current)}`;
};

const createInterval = () => {
  const newInterval = intervalTemplate.cloneNode(true);
  createTextInterval(newInterval.querySelector('.interval__text'));
  newInterval.querySelector('.interval__button-clear').addEventListener('click', () => newInterval.remove());
  return newInterval;
};

const addInterval = () => {
  intervals.prepend(createInterval());
};

const playTimer = (buttonStart, buttonPause) => {
  timerId = setInterval(update, 10);
  buttonStart.textContent = 'Interval';
  buttonPause.textContent = 'Pause';
  buttonStart.value = 'interval';
  buttonPause.value = 'pause';
  buttonPause.removeAttribute('disabled');
};

const pauseTimer = (buttonStart, buttonPause) => {
  centiseconds.updateText();
  clearInterval(timerId);
  buttonStart.textContent = 'Reset';
  buttonPause.textContent = 'Continue';
  buttonStart.value = 'reset';
  buttonPause.value = 'continue';
};

const resetTimer = () => {
  allTimers.forEach(item => {
    item.reset();
    item.updateText();
  });
};

const clearIntervals = () => {
  intervals.innerHTML = '';
};

const resetAll = (buttonStart, buttonPause) => {
  resetTimer();
  clearIntervals();
  countIntervals = 1;
  buttonStart.textContent = 'Start';
  buttonPause.textContent = 'Pause';
  buttonStart.value = 'start';
  buttonPause.value = 'pause';
  buttonPause.setAttribute('disabled', true);
};

const polymorphButtonStart = (event, buttonNotThis) => {
  const buttonThis = event.target;
  switch (buttonThis.value) {
    case 'interval':
      addInterval();
      break;
    case 'start':
      playTimer(buttonThis, buttonNotThis);
      break;
    case 'reset':
      resetAll(buttonThis, buttonNotThis);
  }
};

const polymorphButtonPause = (event, buttonNotThis) => {
  const buttonThis = event.target;
  switch (buttonThis.value) {
    case 'continue':
      playTimer(buttonNotThis, buttonThis);
      break;
    case 'pause':
      pauseTimer(buttonNotThis, buttonThis);
  }
};

const createTimer = () => {
  return new Stopwatch(timerTemplate.cloneNode(true)).container;
};

const addTimer = () => {
  document.body.append(createTimer());
};

buttonStart.addEventListener('click', event => polymorphButtonStart(event, buttonPause));
buttonPause.addEventListener('click', event => polymorphButtonPause(event, buttonStart));
buttonAddTimer.addEventListener('click', addTimer);
//================================================================================================

class Stopwatch {
  constructor(container) {
    this.container = container;
  }
  // mainTimer = this.container.querySelector('.main-timer')
  // buttonStart = this.container.querySelector('.start')
  // buttonPause = this.container.querySelector('.pause')
  // intervals = this.container.querySelector('.container-interval');

  timerId;
  countIntervals = 1;

  hours = new Timer(mainTimer.querySelector('.hours'), undefined, 99);
  minutes = new Timer(mainTimer.querySelector('.minutes'), hours, 60);
  seconds = new Timer(mainTimer.querySelector('.seconds'), minutes, 60);
  centiseconds = new Timer(mainTimer.querySelector('.miliseconds'), seconds, 100, true);
  allTimers = [hours, minutes, seconds, centiseconds];

  update = this.centiseconds.update.bind(this.centiseconds);
}

const newTimer = timerTemplate.cloneNode(true);
const stopWatch = new Stopwatch(newTimer);
console.log(stopWatch.container);
console.log(stopWatch.container.querySelector('.start'));
