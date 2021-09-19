// Convert date object to secondss
export function dateToSeconds(time) {
  return Math.round((time.getTime() / 1000));
}

// Takes Date obj or number of seconds
// Returns obj of d/h/m/s & timePassed bool flag
// Adapted from https://stackoverflow.com/a/13904120/2368033
export function dateToTimeObj(time) {
  const now = new Date();
  // If not a Date()
  if (!(time instanceof Date) || isNaN(time)) {
    return null;
  }
  // Date has passed
  if (time < now) {
    return { d: 0, h: 0, m: 0, s: 0, timePassed: true };
  }
  // Get diff in seconds between both dates
  let delta = dateToSeconds(time) - dateToSeconds(now);
  // Calc days
  const d = Math.floor(delta / 86400); // 60 * 60 * 24 = 86400
  delta -= d * 86400;
  // Calc hrs
  const h = Math.floor(delta / 3600) % 24; // 60 * 60 = 3600
  delta -= h * 3600;
  // Calc mins
  const m = Math.floor(delta / 60) % 60;
  delta -= m * 60;
  // Calc secs
  const s = delta % 60;
  return { d, h, m, s, timePassed: false };
}

export function formatAMPM(date, { trimMins = false, amPmLowerCase = false, trimSpace = false } = {}) {
  const args = { hour: 'numeric' };
  if (!trimMins) {
    args.minute = 'numeric';
  }

  let newDate = date.toLocaleTimeString('en-US', args);

  if (amPmLowerCase) {
    newDate = newDate.toLowerCase();
  }
  if (trimSpace) {
    newDate = newDate.replace(' ', '');
  }
  return newDate;
}
