class SeekBar {
  constructor(id) {
    this.element = document.querySelector(id);
    this.castdebugger = null;
    this.show = false;
  }
  setCastDebugger(castdebugger) {
    this.castdebugger = castdebugger;
  }
  setProgress(time, duration) {
    this.castdebugger.debug("ele", JSON.stringify(this.element));
    this.element.style.width = (time / duration) * 100 + "%";
    this.element.style.backgroundColor = "#fff";
    this.castdebugger.debug("width", this.element.style.width);
  }

  showHide(timing) {
    this.castdebugger.debug("showHide", `${timing} ${this.show}`);
    if (this.show) {
      this.element.parentElement.style.display = "block";
    } else {
      setTimeout(() => {
        this.element.parentElement.style.display = "none";
      }, timing);
    }
  }
}

export default SeekBar;
