import { LazyModule, LazyAction } from 'owa-bundling';

export const lazyCalendarAutoSelectModule = new LazyModule(() => {
    return import(/* webpackChunkName: "CalendarAutoSelecter" */ './lazyIndex').then(result => {
        result.initialize();
        return result;
    });
});

export let lazyTryAutoSelect = new LazyAction(lazyCalendarAutoSelectModule, m => m.tryAutoSelect);
