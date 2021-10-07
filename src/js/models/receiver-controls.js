import SeekBar from "./seekbar";
import Timer from "./timer";
class ReceiverControls {
  constructor() {
    this.seekbar = new SeekBar(".seekbar-progress");
    this.timer = new Timer(".timer");
    this.castDebugger = null;
  }
  setCastDebugger(castDebugger) {
    this.castDebugger = castDebugger;
    this.seekbar.setCastDebugger(this.castDebugger);
  }
  update(state) {
    this.seekbar.update(state.currenTtime, state.duration);
    this.timer.update(state.currenTtime, state.duration);
  }
}

export default ReceiverControls;
