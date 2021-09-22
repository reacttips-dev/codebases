import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

export { default as getMeetingCardProps } from './utils/getMeetingCardProps';
export { default as getInitialViewState } from './utils/getInitialViewState';

export type { CalendarCardViewState } from './store/schema/CalendarCardViewState';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarCard" */ './lazyIndex')
);

export let CalendarCard = createLazyComponent(lazyModule, m => m.CalendarCard);
export let CalendarCardBottom = createLazyComponent(lazyModule, m => m.CalendarCardBottom);

export let lazyInitializeCalendarCard = new LazyAction(lazyModule, m => m.initializeCalendarCard);
