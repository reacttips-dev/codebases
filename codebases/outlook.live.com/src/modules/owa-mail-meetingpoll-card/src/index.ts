import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MeetingPollCard" */ './lazyIndex')
);

export let MeetingPollCard = createLazyComponent(lazyModule, m => m.MeetingPollCard);

export let lazyInitializeMeetingPollCard = new LazyAction(
    lazyModule,
    m => m.initializeMeetingPollCard
);
