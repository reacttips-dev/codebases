import moment from 'moment';

const formatSecondsToDuration = (averageListenSeconds: number): string => {
  const [hour, min, seconds] = moment
    .utc(averageListenSeconds * 1000)
    .format('H:m:s')
    .split(':')
    .map(Number);

  const printHour = hour > 0 ? `${hour}h ` : '';
  const printMinutes = min > 0 ? `${min}m ` : '';
  const printSeconds = `${seconds}s`;
  return printHour + printMinutes + printSeconds;
};

type FormatTimestampDurationOptions = {
  roundMilliseconds?: boolean;
  omitZeroHours?: boolean;
};

/**
 *
 * this will convert a timestamp (in ms) to a formatted
 * duration string
 * will return a full timestamp string formatted like: 00:34:56.789
 * or with options, it can return: 34:57
 */
function getFormattedTimestamp(
  timestampInMs: number,
  options: FormatTimestampDurationOptions = {
    roundMilliseconds: false,
    omitZeroHours: false,
  }
) {
  const { roundMilliseconds, omitZeroHours } = options;
  let remainder = timestampInMs;
  const hours = Math.floor(remainder / 3.6e6);
  remainder = remainder - hours * 3.6e6;
  const minutes = Math.floor(remainder / 60000);
  remainder = remainder - minutes * 60000;

  let seconds;
  let milliseconds;

  if (roundMilliseconds) {
    seconds = Math.round(remainder / 1000);
  } else {
    seconds = Math.floor(remainder / 1000);
    remainder = remainder - seconds * 1000;
    milliseconds = remainder;
  }

  const hoursString =
    omitZeroHours && hours === 0 ? '' : `${hours.toString().padStart(2, '0')}:`;
  const minutesString = minutes.toString().padStart(2, '0');
  const secondsString = seconds.toString().padStart(2, '0');
  const millisecondsString =
    milliseconds !== undefined
      ? `.${milliseconds.toString().padEnd(3, '0')}`
      : '';
  return `${hoursString}${minutesString}:${secondsString}${millisecondsString}`;
}

export { formatSecondsToDuration, getFormattedTimestamp };
