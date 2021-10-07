class Timer {
  constructor(id) {
    this.element = document.querySelector(id);
  }
  update(currentTime, duration) {
    let currentMinutes = Math.floor(currentTime / 60);
    if (currentMinutes.length == 1) {
      currentMinutes = "0" + currentMinutes;
    }
    currentTime = currentTime % 60;
    let durationMinutes = Math.floor(duration / 60);
    if (durationMinutes.length == 1) {
      durationMinutes = "0" + durationMinutes;
    }

    this.element.innerHtml = `${currentMinutes}:${currentTime} / ${durationMinutes}:${duration}`;
  }
}

export default Timer;
