import { LazyAction, LazyModule } from 'owa-bundling';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarComposeFormLifecycle"*/ './lazyIndex')
);

export const lazyOpenCalendarFullCompose = new LazyAction(
    lazyModule,
    m => m.openCalendarFullCompose
);
