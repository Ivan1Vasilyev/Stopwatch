function isZeroNeed(num) {
  return String(num).length == 1 ? '0' + num : num;
}

const intervalTemplate = document.getElementById('interval-template').content.querySelector('.interval'),
  stopwatchTemplate = document.getElementById('timer-template').content.querySelector('.main-container'),
  buttonAddTimer = document.querySelector('.add'),
  buttonSettings = {
    interval: ['interval', 'Interval'],
    pause: ['pause', 'Pause'],
    reset: ['reset', 'Reset'],
    continue: ['continue', 'Continue'],
    start: ['start', 'Start'],
  };

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
    this.updateText();
  }
}

class Stopwatch {
  constructor(container) {
    this.container = container;
  }

  timer;
  countIntervals = 1;

  createContent() {
    this.buttonStart = this.container.querySelector('.start');
    this.buttonPause = this.container.querySelector('.pause');
    this.intervals = this.container.querySelector('.container-interval');
    this.hours = new Timer(this.container.querySelector('.hours'), undefined, 99);
    this.minutes = new Timer(this.container.querySelector('.minutes'), this.hours, 60);
    this.seconds = new Timer(this.container.querySelector('.seconds'), this.minutes, 60);
    this.centiseconds = new Timer(this.container.querySelector('.centiseconds'), this.seconds, 100, true);
    this.allTimers = [this.hours, this.minutes, this.seconds, this.centiseconds];
    this.addButtonsListeners();
  }

  createTextInterval(place) {
    place.textContent = `${this.countIntervals++}) ${isZeroNeed(this.hours.current)}
    :${isZeroNeed(this.minutes.current)}:${isZeroNeed(this.seconds.current)}:${isZeroNeed(this.centiseconds.current)}`;
  }

  createInterval() {
    const newInterval = intervalTemplate.cloneNode(true);
    this.createTextInterval(newInterval.querySelector('.interval__text'));
    newInterval.querySelector('.interval__button-clear').addEventListener('click', () => newInterval.remove());
    return newInterval;
  }

  addInterval() {
    this.intervals.prepend(this.createInterval());
  }

  setButtons(buttonStart, buttonPause, setStart, setPause) {
    buttonStart.value = setStart[0];
    buttonStart.textContent = setStart[1];
    buttonPause.value = setPause[0];
    buttonPause.textContent = setPause[1];
  }

  playTimer(buttonStart, buttonPause) {
    this.timer = setInterval(this.centiseconds.update.bind(this.centiseconds), 10);
    this.setButtons(buttonStart, buttonPause, buttonSettings.interval, buttonSettings.pause);
    buttonPause.removeAttribute('disabled');
  }

  pauseTimer(buttonStart, buttonPause) {
    clearInterval(this.timer);
    this.centiseconds.updateText();
    this.setButtons(buttonStart, buttonPause, buttonSettings.reset, buttonSettings.continue);
  }

  resetTimers() {
    this.allTimers.forEach(timer => {
      timer.reset();
      timer.updateText();
    });
  }

  clearIntervals() {
    this.intervals.innerHTML = '';
  }

  resetAll(buttonStart, buttonPause) {
    this.resetTimers();
    this.clearIntervals();
    this.countIntervals = 1;
    this.setButtons(buttonStart, buttonPause, buttonSettings.start, buttonSettings.pause);
    buttonPause.setAttribute('disabled', true);
  }

  polymorphButtonStart(event, buttonPause) {
    const buttonStart = event.target;
    switch (buttonStart.value) {
      case buttonSettings.interval[0]:
        this.addInterval();
        break;
      case buttonSettings.start[0]:
        this.playTimer(buttonStart, buttonPause);
        break;
      case buttonSettings.reset[0]:
        this.resetAll(buttonStart, buttonPause);
    }
  }

  polymorphButtonPause(event, buttonStart) {
    const buttonPause = event.target;
    switch (buttonPause.value) {
      case buttonSettings.continue[0]:
        this.playTimer(buttonStart, buttonPause);
        break;
      case buttonSettings.pause[0]:
        this.pauseTimer(buttonStart, buttonPause);
    }
  }

  addButtonsListeners() {
    this.buttonStart.addEventListener('click', event => this.polymorphButtonStart(event, this.buttonPause));
    this.buttonPause.addEventListener('click', event => this.polymorphButtonPause(event, this.buttonStart));
  }
}

const createStopwatch = () => {
  const newStopwatch = new Stopwatch(stopwatchTemplate.cloneNode(true));
  newStopwatch.createContent();
  return newStopwatch.container;
};

const addStopwatch = () => {
  document.body.append(createStopwatch());
};

buttonAddTimer.addEventListener('click', addStopwatch);

document.body.prepend(createStopwatch());
//================================================================================================
