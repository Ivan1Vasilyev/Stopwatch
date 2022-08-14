const buttonSettings = {
    interval: ['interval', 'Interval', 'stopwatch__button-interval'],
    pause: ['pause', 'Pause', 'stopwatch__button-pause'],
    reset: ['reset', 'Reset', 'stopwatch__button-stop'],
    continue: ['continue', 'Continue', 'stopwatch__button-start'],
    start: ['start', 'Start', 'stopwatch__button-start'],
    default: ['pause', 'Pause', 'button_inactive'],
  };

class Timer {
  constructor(place, next, uppestValue) {
    this.place = place;
    this.next = next;
    this.uppestValue = uppestValue;
  }

  current = 0;

  updateText() {
    this.place.textContent = String(this.current).length == 1 ? '0' + this.current : this.current;
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
    this.centiseconds = new Timer(this.container.querySelector(selectors.centiseconds), this.seconds, 100);
    this.allTimers = [this.hours, this.minutes, this.seconds, this.centiseconds];
    this.addButtonsListeners();
  }

  createTextInterval(place) {
    place.textContent = `${this.countIntervals++}) ${this.hours.place.textContent}:${this.minutes.place.textContent}:${this.seconds.place.textContent}:${this.centiseconds.place.textContent}`;
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
    this.setButtons(buttonSettings.interval, buttonSettings.pause);
    this.buttonPause.removeAttribute('disabled');
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.setButtons(buttonSettings.reset, buttonSettings.continue);
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

  resetAll() {
    this.resetTimers();
    this.clearIntervals();
    this.countIntervals = 1;
    this.setButtons(buttonSettings.start, buttonSettings.default);
    this.buttonPause.setAttribute('disabled', true);
  }

  polymorphButtonStart(event) {
    switch (event.currentTarget.value) {
      case buttonSettings.interval[0]:
        this.addInterval();
        break;
      case buttonSettings.start[0]:
        this.playTimer();
        break;
      case buttonSettings.reset[0]:
        this.resetAll();
    }
  }

  polymorphButtonPause(event) {
    switch (event.currentTarget.value) {
      case buttonSettings.continue[0]:
        this.playTimer();
        break;
      case buttonSettings.pause[0]:
        this.pauseTimer();
    }
  }

  addButtonsListeners() {
    this.buttonStart.addEventListener('click', event => this.polymorphButtonStart(event));
    this.buttonPause.addEventListener('click', event => this.polymorphButtonPause(event));
  }
}
