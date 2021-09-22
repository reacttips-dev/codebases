import { createLazyComponent, LazyAction, LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Skype"*/ './lazyIndex'));

// Delay loaded components
export const SkypeGlimpse = createLazyComponent(lazyModule, m => m.SkypeGlimpse);

export const lazyUpdateIsGlimpseOpen = new LazyAction(lazyModule, m => m.updateIsGlimpseOpen);

export const lazyShouldShowUnreadConversationCount = new LazyImport(
    lazyModule,
    m => m.shouldShowUnreadConversationCount
);

export let lazyBeginSkypeInitialization = new LazyAction(
    lazyModule,
    m => m.beginSkypeInitialization
);
export let lazyCreateOnSwcReadyEvent = new LazyAction(lazyModule, m => m.createOnSwcReadyEvent);
export const lazyOnNotificationReceived = new LazyAction(lazyModule, m => m.onNotificationReceived);
export const lazyOnHideNotificationReceived = new LazyAction(
    lazyModule,
    m => m.onHideNotificationReceived
);

export { default as isSkypeInTabsEnabled } from './utils/isSkypeInTabsEnabled';
export { default as shouldOwaInitializeSkype } from './utils/shouldOwaInitializeSkype';
export { default as addChatTab } from './utils/addChatTabActionCreator';
export { default as skypeStore } from './store/store';
