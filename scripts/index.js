const selectors = {
    buttonAddStopwatch: '.add',
    buttonClearInterval: '.interval__button-clear',
    buttonPause: '.stopwatch__button-pause',
    buttonStart: '.stopwatch__button-start',
    buttonInterval: '.stopwatch__button-interval',
    buttonReset: '.stopwatch__button-reset',
    buttonCloseIcon: '.stopwatch__close-icon',
    buttonInactiveClass: 'button_inactive',
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
    textInterval: '.interval__text',
  },
  intervalTemplate = document.getElementById(selectors.intervalTemplateId).content.querySelector(selectors.intervalTemplate),
  stopwatchTemplate = document.getElementById(selectors.stopwatchTemplateId).content.querySelector(selectors.stopwatchTemplate),
  stopwatchContainer = document.querySelector(selectors.stopwatchContainer),
  buttonAddStopwatch = document.querySelector(selectors.buttonAddStopwatch);

class Timer {
  constructor(place, next, uppestValue) {
    this.place = place;
    this.next = next;
    this.uppestValue = uppestValue;
  }

  current = 0;

  updateText() {
    this.place.textContent = this.current < 10 ? '0' + this.current : this.current;
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
    this.buttonInterval = this.container.querySelector(selectors.buttonInterval);
    this.buttonReset = this.container.querySelector(selectors.buttonReset);
    this.buttonCloseIcon = this.container.querySelector(selectors.buttonCloseIcon)
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

  resetTimers() {
    this.allTimers.forEach(timer => {
      timer.reset();
      timer.updateText();
    });
  }

  clearIntervals() {
    this.intervals.innerHTML = '';
  }

  setButtonEnable(...buttons) {
    buttons.forEach(button => {
      button.removeAttribute('disabled');
      button.classList.remove(selectors.buttonInactiveClass);
    })
  }

  setButtonDisable(...buttons) {
    buttons.forEach(button => {
      button.setAttribute('disabled', true);
      button.classList.add(selectors.buttonInactiveClass);
    })
  }

  resetAll() {
    this.resetTimers();
    this.clearIntervals();
    this.countIntervals = 1;
    this.buttonStart.textContent = 'Start'
    this.setButtonDisable(this.buttonReset)
    this.setButtonEnable(this.buttonStart)
  }

  playTimer() {
    this.timer = setInterval(this.centiseconds.update.bind(this.centiseconds), 10);
    this.setButtonDisable(this.buttonStart, this.buttonReset)
    this.setButtonEnable(this.buttonPause, this.buttonInterval)
  }

  pauseTimer() {
    clearInterval(this.timer);
    this.buttonStart.textContent = 'Continue'
    this.setButtonDisable(this.buttonPause, this.buttonInterval)
    this.setButtonEnable(this.buttonStart, this.buttonReset)
  }

  closeStopwatch() {
    this.container.remove()
    this.container = null
  }

  addButtonsListeners() {
    this.buttonStart.addEventListener('click', () => this.playTimer());
    this.buttonPause.addEventListener('click', () => this.pauseTimer());
    this.buttonInterval.addEventListener('click', () => this.addInterval());
    this.buttonReset.addEventListener('click', () => this.resetAll());
    this.buttonCloseIcon.addEventListener('click', () => this.closeStopwatch())
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

buttonAddStopwatch.addEventListener('click', addStopwatch);

addStopwatch();
//================================================================================================
