const formatTime = (time) => {
  if (!time) return "00:00";

  let hours = Math.floor(time / 3600);
  let minutes = Math.floor((time - hours * 3600) / 60);
  let seconds = Math.floor(time % 60);

  // format the minutes and seconds string to look consistent across all values
  if (!hours) {
    return (
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0")
    );
  }

  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
};

export default {
  formatTime,
};
