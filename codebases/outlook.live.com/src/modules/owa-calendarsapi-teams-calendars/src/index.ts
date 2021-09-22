import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "TeamsCalendars" */ './lazyIndex')
);

export const lazyInitializeSelectedTeamsCalendars = new LazyAction(
    lazyModule,
    m => m.initializeSelectedTeamsCalendars
);

export const lazyGetSelectedTeamsCalendars = new LazyAction(
    lazyModule,
    m => m.getSelectedTeamsCalendars
);

export const lazyCreateCalendarCacheInfoFromTeamsChannel = new LazyAction(
    lazyModule,
    m => m.createCalendarCacheInfoFromTeamsChannel
);
