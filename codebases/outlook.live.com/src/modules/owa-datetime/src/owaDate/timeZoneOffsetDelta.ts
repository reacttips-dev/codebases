import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';
import type { OwaDate } from '../schema';
import { getTimezoneOffset } from './getFields';

export default (left: OwaDate, right: OwaDate) =>
    (getTimezoneOffset(left) - getTimezoneOffset(right)) * MILLISECONDS_IN_MINUTE;
