import Utils from "../helpers/Utils";

class Timer {
  constructor(id) {
    this.element = document.querySelector(id);
    this.element.textContent = "00:00 / 00:00";
  }
  update(currentTime, duration) {
    this.element.textContent = `${Utils.formatTime(
      currentTime
    )} /${Utils.formatTime(duration)}`;
  }
}

export default Timer;
