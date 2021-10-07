import SeekBar from "./seekbar";
import Timer from "./timer";
class ReceiverControls {
  constructor(id) {
    this.seekbar = new SeekBar(".seekbar-progress");
    this.timer = new Timer(".timer");
    this.castDebugger = null;
    this.element = document.querySelector(id);
    this.show = true;
  }
  setCastDebugger(castDebugger) {
    this.castDebugger = castDebugger;
    this.seekbar.setCastDebugger(this.castDebugger);
  }
  update(state) {
    this.seekbar.setProgress(state.currenTtime, state.duration);
    this.timer.update(state.currenTtime, state.duration);
  }
  hideControls(time) {
    this.show = false;
    this.showHide(time || 5000);
  }
  showControls() {
    this.show = true;
    this.showHide(10);
  }
  showHide(timing) {
    // this.castdebugger.debug("showHide", `${timing} ${this.show}`);
    if (this.show) {
      this.element.style.display = "block";
    } else {
      setTimeout(() => {
        this.element.style.display = "none";
      }, timing);
    }
  }
}

export default ReceiverControls;
