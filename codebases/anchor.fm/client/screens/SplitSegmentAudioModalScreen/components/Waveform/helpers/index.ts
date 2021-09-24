export const formatTimeCallback = (seconds: number, pxPerSec: number) => {
  let secondsNum = Number(seconds);
  const minutesNum = Math.floor(seconds / 60);
  secondsNum = secondsNum % 60;

  // fill up seconds with zeroes
  let secondsStr = Math.round(secondsNum).toString();
  if (pxPerSec >= 25 * 20) {
    secondsStr = seconds.toFixed(2);
  }

  if (secondsNum < 10) {
    secondsStr = `0${secondsStr}`;
  }
  let minutesStr = minutesNum.toString();
  if (minutesNum < 10) {
    minutesStr = `0${minutesNum}`;
  }
  return `${minutesStr}:${secondsStr}`;
};

export const timeInterval = (pxPerSec: number) => {
  let retval = 15;

  if (pxPerSec >= 25 * 100) {
    retval = 0.01;
  } else if (pxPerSec >= 25 * 40) {
    retval = 0.25;
  } else if (pxPerSec >= 25 * 10) {
    retval = 0.1;
  } else if (pxPerSec >= 25 * 4) {
    retval = 0.5;
  } else if (pxPerSec >= 25) {
    retval = 1;
  } else if (pxPerSec * 5 >= 25) {
    retval = 10;
  } else {
    retval = Math.ceil(0.5 / pxPerSec) * 120;
  }
  return retval;
};

export const primaryLabelInterval = (pxPerSec: number) => {
  let retval = 15;
  if (pxPerSec >= 25 * 100) {
    retval = 100;
  } else if (pxPerSec >= 25 * 40) {
    retval = 4;
  } else if (pxPerSec >= 25 * 10) {
    retval = 10;
  } else if (pxPerSec >= 25 * 4) {
    retval = 40;
  } else if (pxPerSec * 5 >= 25) {
    retval = 80;
  } else {
    retval = Math.ceil(0.5 / pxPerSec) * 120;
  }
  return retval;
};

export const convertSecondsToTimestamp = (time: number) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor(time - hours * 3600 - minutes * 60);
  const milliseconds = Math.round((time % 1) * 1000)
    .toString()
    .slice(-3);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}.${milliseconds.toString().padStart(3, '0')}`;
};

export const getIsValidTimestamp = (timestamp: string) =>
  /^\d+[:]([0-5][0-9])[:]([0-5][0-9])(\.\d{1,3})?$/g.test(timestamp);

export const convertTimestampToSeconds = (timestamp: string) => {
  // split valid timestamp hh:mm:ss.milliseconds
  const [hours, minutes, seconds] = timestamp.split(':');

  // convert units to seconds and return total
  return (
    parseInt(hours, 10) * 60 * 60 +
    parseInt(minutes, 10) * 60 +
    parseFloat(parseFloat(seconds).toFixed(3))
  );
};
