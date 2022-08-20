class FourButtons {
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
