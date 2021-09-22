import addMonths from './addMonths';
import { MONTHS_IN_YEAR } from 'owa-date-constants';

export default (timestamp: number | Date, years: number) =>
    addMonths(timestamp, years * MONTHS_IN_YEAR);
