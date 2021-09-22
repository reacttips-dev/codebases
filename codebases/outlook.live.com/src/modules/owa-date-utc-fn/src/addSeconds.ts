import { MILLISECONDS_IN_SECOND } from 'owa-date-constants';

export default (timestamp: number | Date, seconds: number) =>
    new Date(+timestamp + seconds * MILLISECONDS_IN_SECOND);
