export default class Timer {
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
