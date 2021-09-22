import { LazyImport, LazyModule, createLazyComponent, LazyAction } from 'owa-bundling';

export { default as isReplyByImEnabled } from './presenceManager/isReplyByImEnabled';
export { default as StartChatSource } from './store/schema/StartChatSource';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SkypeForBusiness"*/ './lazyIndex')
);

export const lazyInitializeSkypeForBusiness = new LazyAction(
    lazyModule,
    m => m.initializeSkypeForBusiness
);

// Export delay loaded functions
export let lazyTryRegisterForPresenceUpdates = new LazyImport(
    lazyModule,
    m => m.tryRegisterForPresenceUpdates
);

export let lazyStartChat = new LazyImport(lazyModule, m => m.startChat);
export let lazySetIsSkypeShown = new LazyAction(lazyModule, m => m.setIsSkypeShown);

export let UcmaChatView = createLazyComponent(lazyModule, m => m.UcmaChatView);
