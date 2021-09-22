import { utcDate } from './owaDate';
import { MIN_JAVASCRIPT_TIMESTAMP, MAX_JAVASCRIPT_TIMESTAMP } from 'owa-date-constants';

export const MIN_JAVASCRIPT_DATE = utcDate(MIN_JAVASCRIPT_TIMESTAMP);
export const MAX_JAVASCRIPT_DATE = utcDate(MAX_JAVASCRIPT_TIMESTAMP);
