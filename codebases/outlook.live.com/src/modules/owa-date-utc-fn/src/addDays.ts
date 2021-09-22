import { MILLISECONDS_IN_DAY } from 'owa-date-constants';

export default (timestamp: number | Date, days: number) =>
    new Date(+timestamp + days * MILLISECONDS_IN_DAY);
