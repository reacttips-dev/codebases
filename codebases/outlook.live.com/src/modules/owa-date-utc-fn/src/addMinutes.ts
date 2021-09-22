import { MILLISECONDS_IN_MINUTE } from 'owa-date-constants';

export default (timestamp: number | Date, minutes: number) =>
    new Date(+timestamp + minutes * MILLISECONDS_IN_MINUTE);
