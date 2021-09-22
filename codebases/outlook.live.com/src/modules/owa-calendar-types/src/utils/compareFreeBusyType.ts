import type CalendarEvent from '../types/CalendarEvent';
import getBusyTypeSortOrder from './getBusyTypeSortOrder';

export default (a: CalendarEvent, b: CalendarEvent) =>
    getBusyTypeSortOrder(a.FreeBusyType) - getBusyTypeSortOrder(b.FreeBusyType);
