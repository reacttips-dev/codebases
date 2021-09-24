import moment from 'moment';

export const roundToNextHour = (value: string | moment.Moment): Date => {
  const momentVal = moment(value);
  if (
    momentVal.milliseconds() !== 0 ||
    momentVal.seconds() !== 0 ||
    momentVal.minutes() !== 0
  ) {
    return momentVal.add(1, 'hours').startOf('hour').toDate();
  }
  return momentVal.toDate();
};

export const getDisplayValue = (
  value?: string | null,
  prefixText?: string | null,
  fallbackValue: string = 'Now'
) => {
  const formattedDateTime = value
    ? moment.utc(value).local().format('M/D/YY [at] h:mm A')
    : null;
  if (formattedDateTime) {
    return prefixText
      ? `${prefixText} ${formattedDateTime}`
      : formattedDateTime;
  }
  return fallbackValue;
};

export const getCurrentDateAtUpcomingHour = () =>
  moment().add(59, 'minutes').startOf('hour');
