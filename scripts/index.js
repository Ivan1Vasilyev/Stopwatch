function isZeroNeed(num) {
  return String(num).length == 1 ? '0' + num : num;
}

const selectors = {
  buttonAddTimer: '.add',
  buttonClearInterval: '.interval__button-clear',
  buttonPause: '.stopwatch__button-pause',
  buttonStart: '.stopwatch__button-start',
  buttonIntervalClass: '.stopwatch__button-interval',
  buttonPauseClass: '.stopwatch__button-pause',
  buttonStartClass: '.stopwatch__button-start',
  buttonStopClass: '.stopwatch__button-stop',
  centiseconds: '#centiseconds',
  hours: '#hours',
  intervals: '.container-interval',
  intervalTemplate: '.interval',
  intervalTemplateId: 'interval-template',
  minutes: '#minutes',
  stopwatchContainer: '.center',
  stopwatchTemplate: '.container',
  stopwatchTemplateId: 'stopwatch-template',
  seconds: '#seconds',
  textInterval: '.interval__text'
},
  intervalTemplate = document.getElementById(selectors.intervalTemplateId).content.querySelector(selectors.intervalTemplate),
  stopwatchTemplate = document.getElementById(selectors.stopwatchTemplateId).content.querySelector(selectors.stopwatchTemplate),
  stopwatchContainer = document.querySelector(selectors.stopwatchContainer),
  buttonAddTimer = document.querySelector(selectors.buttonAddTimer),
  buttonSettings = {
    interval: ['interval', 'Interval', 'stopwatch__button-interval'],
    pause: ['pause', 'Pause', 'stopwatch__button-pause'],
    reset: ['reset', 'Reset', 'stopwatch__button-stop'],
    continue: ['continue', 'Continue', 'stopwatch__button-start'],
    start: ['start', 'Start', 'stopwatch__button-start'],
    default: ['pause', 'Pause', 'stopwatch__button-pause_inactive']
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
    this.buttonStart = this.container.querySelector(selectors.buttonStart);
    this.buttonPause = this.container.querySelector(selectors.buttonPause);
    this.intervals = this.container.querySelector(selectors.intervals);
    this.hours = new Timer(this.container.querySelector(selectors.hours), undefined, 99);
    this.minutes = new Timer(this.container.querySelector(selectors.minutes), this.hours, 60);
    this.seconds = new Timer(this.container.querySelector(selectors.seconds), this.minutes, 60);
    this.centiseconds = new Timer(this.container.querySelector(selectors.centiseconds), this.seconds, 100, true);
    this.allTimers = [this.hours, this.minutes, this.seconds, this.centiseconds];
    this.addButtonsListeners();
  }

  createTextInterval(place) {
    place.textContent = `${this.countIntervals++}) ${isZeroNeed(this.hours.current)}
    :${isZeroNeed(this.minutes.current)}:${isZeroNeed(this.seconds.current)}:${isZeroNeed(this.centiseconds.current)}`;
  }

  createInterval() {
    const newInterval = intervalTemplate.cloneNode(true);
    this.createTextInterval(newInterval.querySelector(selectors.textInterval));
    newInterval.querySelector(selectors.buttonClearInterval).addEventListener('click', () => newInterval.remove());
    return newInterval;
  }

  addInterval() {
    this.intervals.prepend(this.createInterval());
  }

  setButtons(buttonStart, buttonPause, setStart, setPause) {
    buttonStart.value = setStart[0];
    buttonStart.textContent = setStart[1];
    buttonStart.className = 'button'
    buttonStart.classList.add(setStart[2])
    buttonPause.value = setPause[0];
    buttonPause.textContent = setPause[1];
    buttonPause.className = 'button'
    buttonPause.classList.add(setPause[2])
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
    this.setButtons(buttonStart, buttonPause, buttonSettings.start, buttonSettings.default);
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
  stopwatchContainer.append(createStopwatch());
};

buttonAddTimer.addEventListener('click', addStopwatch);

stopwatchContainer.prepend(createStopwatch());
//================================================================================================
