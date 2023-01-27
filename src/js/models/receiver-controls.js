import SeekBar from "./seekbar"
import Timer from "./timer"
class ReceiverControls {
  constructor(id) {
    this.seekbar = new SeekBar(".seekbar-progress")
    this.timer = new Timer(".timer")
    this.castDebugger = null
    this.element = document.querySelector(id)
    this.show = true
    this.loader = document.querySelector(".loader")
    this.playIcon = document.querySelector(".vp-icon-play")
    this.pauseIcon = document.querySelector(".vp-icon-pause")
  }
  setCastDebugger(castDebugger) {
    this.castDebugger = castDebugger
    this.seekbar.setCastDebugger(this.castDebugger)
  }
  pause() {
    this.pauseIcon.style.display = "none"
    this.playIcon.style.display = "block"
    setTimeout(() => {
      this.playIcon.style.display = "none"
    }, 2000)
  }
  play() {
    this.playIcon.style.display = "none"
    this.pauseIcon.style.display = "block"
    setTimeout(() => {
      this.pauseIcon.style.display = "none"
    }, 2000)
  }
  update(state) {
    console.log(state)
    this.seekbar.setProgress(state.currentTime, state.duration)
    this.timer.update(state.currentTime, state.duration)
  }
  hideControls(time) {
    this.show = false
    this.showHide(time || 5000)
  }
  showControls() {
    this.show = true
    this.showHide(10)
  }
  showHide(timing) {
    // this.castdebugger.debug("showHide", `${timing} ${this.show}`);
    if (this.show) {
      this.element.style.display = "flex"
    } else {
      setTimeout(() => {
        this.element.style.display = "none"
      }, timing)
    }
  }
}

export default ReceiverControls
