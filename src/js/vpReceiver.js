import Receiver from "./models/receiver";

//a boolean telling whether HLS is supported in the browser
vpReceiver.HLSsupported = false;

function vpReceiver(id, config) {
  let receiver = new Receiver(id, config);
  receiver.init();
  return receiver;
}

window.vpReceiver = vpReceiver;
