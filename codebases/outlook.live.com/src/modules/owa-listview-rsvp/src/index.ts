import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "RSVP" */ './lazyIndex'));

export const lazyTryPrefetchMeetingMessage = new LazyAction(
    lazyModule,
    m => m.tryPrefetchMeetingMessage
);

export const lazyRemoveMeetingMessagesFromStore = new LazyAction(
    lazyModule,
    m => m.removeMeetingMessagesFromStore
);
