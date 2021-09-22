import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "HelpCharm" */ './lazyIndex'));

export const lazyHandleSocPostMessageEvents = new LazyAction(
    lazyModule,
    m => m.handleSocPostMessageEvents
);

export const lazyLoadMiniMavenHelpWidget = new LazyAction(
    lazyModule,
    m => m.loadMiniMavenHelpWidget
);
