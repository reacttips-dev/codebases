import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

export { default as MeetingMessageButtonEntrySource } from './store/schema/MeetingMessageButtonEntrySource';
export { default as MeetingMessageButton } from './components/MeetingMessageButton';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "RSVPPeek" */ './lazyIndex'));

export const lazyShowRSVPPeek = new LazyAction(lazyModule, m => m.showRSVPPeek);
export const lazyHideRSVPPeek = new LazyAction(lazyModule, m => m.hideRSVPPeek);
export const RSVPPeek = createLazyComponent(lazyModule, m => m.RSVPPeek);
