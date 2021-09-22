import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PopoutCalendar" */ './lazyIndex')
);

export const lazyPopoutCalendarReadingPane = new LazyAction(
    lazyModule,
    m => m.popoutCalendarReadingPane
);
export const lazyPopoutCalendarComposeWithItemId = new LazyAction(
    lazyModule,
    m => m.popoutCalendarComposeWithItemId
);
export const lazyPopoutCalendarCompose = new LazyAction(lazyModule, m => m.popoutCalendarCompose);

export type { SerializableCalendarEvent } from './popoutCalendarTypes';
export { CALENDAR_POPOUT_OPTIONS } from './popoutCalendarConstants';
