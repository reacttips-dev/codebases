import { utcDate } from './owaDate';
import { MIN_OUTLOOK_TIMESTAMP, MAX_OUTLOOK_TIMESTAMP } from 'owa-date-constants';

export const MIN_OUTLOOK_DATE = utcDate(MIN_OUTLOOK_TIMESTAMP);
export const MAX_OUTLOOK_DATE = utcDate(MAX_OUTLOOK_TIMESTAMP);
