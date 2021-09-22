import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(async () => {
    const lazyIndex = await import(/* webpackChunkName: "TimePanelCalendar"*/ './lazyIndex');
    // initialize the agenda scenario
    lazyIndex.initializeAgenda();
    return lazyIndex;
});

// Delay loaded components
export const CalendarList = createLazyComponent(lazyModule, m => m.CalendarList);

// Delayed loaded actions
export const lazyResetCalendarView = new LazyAction(lazyModule, m => m.resetCalendarView);

// Non-lazy actions
export {
    clickCalendarEvent,
    doubleClickCalendarEvent,
    clickAgendaTodo,
} from './actions/publicActions';

export { openComposeView } from './actions/openComposeViewAction';
