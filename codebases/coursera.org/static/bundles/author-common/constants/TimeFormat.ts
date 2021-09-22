const TIME_FORMAT = {
  date: 'YYYY-MM-DD',
  time: 'hh:mm A',
  timezoneFormat: 'z',
  dateTimeFormat: 'YYYY-MM-DDTHH:mm:ss',
} as const;

const DISPLAY_TIME_FORMAT = {
  dateTimeWithoutTimezone: 'MM/DD/YYYY hh:mm A',
  dateTime: 'MM/DD/YYYY hh:mm A z',
} as const;

const TIME_ZONE = 'America/Los_Angeles';

const exported = {
  DISPLAY_TIME_FORMAT,
  TIME_FORMAT,
  TIME_ZONE,
} as const;

export default exported;
export { DISPLAY_TIME_FORMAT, TIME_FORMAT, TIME_ZONE };
