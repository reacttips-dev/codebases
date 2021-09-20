import { CardDate } from '@atlassian/butler-command-parser';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getNumberProperty(obj: any) {
  const propName = Object.keys(obj).find((k) => typeof obj[k] === 'number');
  if (!propName) {
    return null;
  }
  const value = obj[propName];
  return {
    propName,
    value,
  };
}

interface DateParams {
  time?: number;
  timeframe?: string;
}

export function parseDueOrStartDate(date: CardDate): DateParams {
  const prop = date.IN_X_FROM_TODAY
    ? getNumberProperty(date.IN_X_FROM_TODAY)
    : getNumberProperty(date);
  const { value: time, propName: timeframe } = prop || {};
  return { time, timeframe };
}

export function getDueOrStartDate({ time, timeframe }: DateParams) {
  if (typeof time === 'number' && !!timeframe) {
    if (timeframe === 'IN_MINUTES' || timeframe === 'IN_HOURS') {
      return { [timeframe]: time };
    } else if (timeframe) {
      return {
        IN_X_FROM_TODAY: { [timeframe]: time },
      };
    }
  }
  return {};
}
