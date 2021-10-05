import Receiver from "./models/receiver";

//a boolean telling whether HLS is supported in the browser
vpPlayer.HLSsupported = false;

function vpReceiver(id, config) {
  const receiver = new Receiver(id, config);

  receiver.fakeinit();
}

window.vpReceiver = vpReceiver;
