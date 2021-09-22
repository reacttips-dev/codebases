import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ComposeFeedback" */ './lazyIndex')
);

export const ComposeFeedback = createLazyComponent(lazyModule, m => m.ComposeFeedback);
export type { default as ComposeFeedbackViewState } from './store/schema/ComposeFeedbackViewState';
export { default as createComposeFeedbackViewState } from './utils/createComposeFeedbackViewState';
export const lazyShowFeedbackRibbon = new LazyAction(lazyModule, m => m.showFeedbackRibbon);
export const lazyHideFeedbackRibbon = new LazyAction(lazyModule, m => m.hideFeedbackRibbon);
