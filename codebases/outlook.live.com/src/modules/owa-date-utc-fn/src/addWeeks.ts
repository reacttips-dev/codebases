import { MILLISECONDS_IN_WEEK } from 'owa-date-constants';

export default (timestamp: number | Date, weeks: number) =>
    new Date(+timestamp + weeks * MILLISECONDS_IN_WEEK);
