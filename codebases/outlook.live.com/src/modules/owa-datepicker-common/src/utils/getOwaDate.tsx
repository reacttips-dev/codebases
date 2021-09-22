import { owaDate } from 'owa-datetime';

export default (tz: string, date: Date) =>
    owaDate(tz, date.getFullYear(), date.getMonth(), date.getDate());
