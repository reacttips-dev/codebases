import { LazyModule, createLazyComponent, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "WhatsNew" */ './lazyIndex'));

export { getUnreadWhatsNewCardCount } from './selectors/getUnreadWhatsNewCardCount';
export { openPauseInboxMenu } from './actions/openPauseInboxMenu';

export let WhatsNewFluentPane = createLazyComponent(lazyModule, m => m.WhatsNewFluentPane);
export let initializeWhatsNewCardsLazy = new LazyAction(
    lazyModule,
    m => m.initializeWhatsNewIfNecessary
);
export let lazyOpenPremiumDashboard = new LazyAction(lazyModule, m => m.openPremiumDashboard);
