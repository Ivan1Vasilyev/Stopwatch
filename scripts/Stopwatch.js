export default class Stopwatch {
  static buttonSettings = {
    interval: ['interval', 'Interval', 'stopwatch__button-interval'],
    pause: ['pause', 'Pause', 'stopwatch__button-pause'],
    reset: ['reset', 'Reset', 'stopwatch__button-reset'],
    continue: ['continue', 'Continue', 'stopwatch__button-start'],
    start: ['start', 'Start', 'stopwatch__button-start'],
    default: ['pause', 'Pause', 'button_inactive'],
  }
  constructor(container, intervalTemplate, selectors, timersHandle) {
    this.container = container;
    this.intervalTemplate = intervalTemplate
    this.timersHandle = timersHandle
    this.selectors = selectors
  }

  timer;
  countIntervals = 1;

  createContent() {
    this.buttonStart = this.container.querySelector(this.selectors.buttonStart);
    this.buttonPause = this.container.querySelector(this.selectors.buttonPause);
    this.buttonInterval = this.container.querySelector(this.selectors.buttonInterval);
    this.buttonReset = this.container.querySelector(this.selectors.buttonReset);
    this.buttonCloseIcon = this.container.querySelector(this.selectors.buttonCloseIcon);
    this.intervals = this.container.querySelector(this.selectors.intervals);
    this.hours = this.timersHandle(this.container.querySelector(this.selectors.hours), undefined, 99);
    this.minutes = this.timersHandle(this.container.querySelector(this.selectors.minutes), this.hours, 60);
    this.seconds = this.timersHandle(this.container.querySelector(this.selectors.seconds), this.minutes, 60);
    this.centiseconds = this.timersHandle(this.container.querySelector(this.selectors.centiseconds), this.seconds, 100);
    this.allTimers = [this.hours, this.minutes, this.seconds, this.centiseconds];
    this.addButtonsListeners();
  }

  createTextInterval(place) {
    place.textContent = `${this.countIntervals++}) ${this.hours.place.textContent}:${this.minutes.place.textContent}:${this.seconds.place.textContent}:${this.centiseconds.place.textContent}`;
  }

  createInterval() {
    const newInterval = this.intervalTemplate.cloneNode(true);
    newInterval.querySelector(this.selectors.numberInterval).textContent = `${this.countIntervals++})`;
    newInterval.querySelector(this.selectors.textInterval).textContent = `${this.hours.place.textContent}:${this.minutes.place.textContent}:${this.seconds.place.textContent}:${this.centiseconds.place.textContent}`;
    newInterval.querySelector(this.selectors.buttonClearInterval).addEventListener('click', () => newInterval.remove());
    return newInterval;
  }

  addInterval() {
    this.intervals.prepend(this.createInterval());
  }

  setButtons(settingsStart, settingsPause) {
    this.buttonStart.value = settingsStart[0];
    this.buttonStart.textContent = settingsStart[1];
    this.buttonStart.className = `button ${settingsStart[2]}`;
    this.buttonPause.value = settingsPause[0];
    this.buttonPause.textContent = settingsPause[1];
    this.buttonPause.className = `button ${settingsPause[2]}`;
  }

  playTimer() {
    this.timer = setInterval(this.centiseconds.update.bind(this.centiseconds), 10);
    this.setButtons(Stopwatch.buttonSettings.interval, Stopwatch.buttonSettings.pause);
    this.buttonPause.removeAttribute('disabled');
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.setButtons(Stopwatch.buttonSettings.reset, Stopwatch.buttonSettings.continue);
  }

  resetTimers() {
    this.allTimers.forEach(timer => {
      timer.reset();
      timer.updateText();
    });
  }

  resetAll() {
    this.resetTimers();
    this.intervals.innerHTML = '';
    this.countIntervals = 1;
    this.setButtons(Stopwatch.buttonSettings.start, Stopwatch.buttonSettings.default);
    this.buttonPause.setAttribute('disabled', true);
  }

  polymorphButtonStart(event) {
    switch (event.currentTarget.value) {
      case Stopwatch.buttonSettings.interval[0]:
        this.addInterval();
        break;
      case Stopwatch.buttonSettings.start[0]:
        this.playTimer();
        break;
      case Stopwatch.buttonSettings.reset[0]:
        this.resetAll();
    }
  }

  polymorphButtonPause(event) {
    switch (event.currentTarget.value) {
      case Stopwatch.buttonSettings.continue[0]:
        this.playTimer();
        break;
      case Stopwatch.buttonSettings.pause[0]:
        this.pauseTimer();
    }
  }

  closeStopwatch() {
    this.container.remove()
    this.container = null
  }

  addButtonsListeners() {
    this.buttonStart.addEventListener('click', event => this.polymorphButtonStart(event));
    this.buttonPause.addEventListener('click', event => this.polymorphButtonPause(event));
    this.buttonCloseIcon.addEventListener('click', () => this.closeStopwatch());
  }
}
