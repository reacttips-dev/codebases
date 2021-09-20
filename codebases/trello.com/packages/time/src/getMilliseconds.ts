export interface GetMillisecondsOptions {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  ms?: number;
  years?: number;
  months?: number;
  weeks?: number;
}

export const getMilliseconds = (args: GetMillisecondsOptions) => {
  let { days = 0, hours = 0, minutes = 0, seconds = 0, ms = 0 } = args;
  const { years = 0, months = 0, weeks = 0 } = args;

  if (years) {
    days += years * 365;
  }

  if (months) {
    days += months * 30;
  }

  if (weeks) {
    days += weeks * 7;
  }

  hours += days * 24;
  minutes += hours * 60;
  seconds += minutes * 60;
  ms += seconds * 1000;

  return ms;
};
