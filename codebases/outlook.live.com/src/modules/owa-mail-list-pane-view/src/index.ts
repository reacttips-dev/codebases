import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "ListPane" */ './lazyIndex'));

// Delayed Loaded Components
export let InboxPausedBanner = createLazyComponent(lazyModule, m => m.InboxPausedBanner);
export let MailListColumnHeaders = createLazyComponent(lazyModule, m => m.MailListColumnHeaders);

export { default as ListPane } from './components/ListPane';
