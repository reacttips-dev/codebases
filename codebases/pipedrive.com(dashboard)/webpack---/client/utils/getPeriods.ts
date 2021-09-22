import moment, { unitOfTime } from 'moment';

const ISO_DATE_LENGTH = 'YYYY-MM-DD'.length;

export const getStartOfNextPeriod = (interval: unitOfTime.StartOf) =>
	moment().startOf(interval).startOf('day').toISOString(true).slice(0, ISO_DATE_LENGTH);

export const getEndOfNextPeriod = (interval: unitOfTime.StartOf) =>
	moment().endOf(interval).endOf('day').toISOString(true).slice(0, ISO_DATE_LENGTH);

export const getIntervalStartDate = (interval?: unitOfTime.StartOf) =>
	interval ? moment().startOf(interval).format('YYYY-MM-DD') : moment().startOf('month').format('YYYY-MM-DD');

export const getNextStartDate = (startDate, interval, addCount) =>
	moment(startDate).add(`${interval}s`, addCount).format('YYYY-MM-DD');

export const getPreviousStartDate = (startDate, interval, subtractCount) =>
	moment(startDate).subtract(`${interval}s`, subtractCount).format('YYYY-MM-DD');
