import { LazyModule, LazyImport, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FeedbackForm"*/ './lazyIndex')
);

export let CaptureFeedbackDatapoint = new LazyImport(lazyModule, m => m.captureFeedbackDatapoint);
export let lazySendFeedbackToOds = new LazyImport(lazyModule, m => m.sendFeedbackToOds);
export let lazyGetTokenForOds = new LazyAction(lazyModule, m => m.getTokenForOds);
export { default as isFeedbackEnabled } from './utils/isFeedbackEnabled';

export type { OdsFeedbackOverrides } from './schema/OdsFeedbackOverrides';
