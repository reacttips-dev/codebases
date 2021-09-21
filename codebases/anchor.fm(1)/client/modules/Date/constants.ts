// second representations of time
// todo: get a library for months, leap years, etc.
export const YEAR_SECS = 31536000; // not leap year
export const MONTH_SECS = 2628000; // rough estimate
export const WEEK_SECS = 604800;
export const DAY_SECS = 86400;
export const HR_SECS = 3600;
export const MIN_SECS = 60;

// For use with DOB select inputs
const currentYear = new Date().getFullYear();
export const yearOptions = Array.from({ length: 117 }, (_, i) => {
  const year = String(currentYear - i);
  return {
    label: year,
    value: year,
  };
});

export const dayOptions = Array.from({ length: 31 }, (_, i) => ({
  label: String(i + 1),
  value: (i + 1).toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }),
}));

export const monthOptions = [
  {
    label: 'January',
    value: '01',
  },
  {
    label: 'February',
    value: '02',
  },
  {
    label: 'March',
    value: '03',
  },
  {
    label: 'April',
    value: '04',
  },
  {
    label: 'May',
    value: '05',
  },
  {
    label: 'June',
    value: '06',
  },
  {
    label: 'July',
    value: '07',
  },
  {
    label: 'August',
    value: '08',
  },
  {
    label: 'September',
    value: '09',
  },
  {
    label: 'October',
    value: '10',
  },
  {
    label: 'November',
    value: '11',
  },
  {
    label: 'December',
    value: '12',
  },
];
