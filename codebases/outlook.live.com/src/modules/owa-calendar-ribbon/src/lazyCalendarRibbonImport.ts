import { LazyBootModule, LazyImport } from 'owa-bundling-light';

export const LazyCalendarRibbonImport = new LazyImport(
    new LazyBootModule(() => import(/* webpackChunkName: "CalendarRibbonImport" */ './lazyIndex')),
    m => m.CalendarRibbon
);
