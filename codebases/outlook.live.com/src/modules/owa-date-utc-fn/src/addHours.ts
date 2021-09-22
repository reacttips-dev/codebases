import { MILLISECONDS_IN_HOUR } from 'owa-date-constants';

export default (timestamp: number | Date, hours: number) =>
    new Date(+timestamp + hours * MILLISECONDS_IN_HOUR);
