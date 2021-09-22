import { LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaPersonalization"*/ './lazyIndex')
);

export let lazyInitializePersonalizationSuggestions = new LazyAction(
    lazyModule,
    m => m.initializePersonalizationSuggestions
);
export let lazyPostPersonalizationSuggestionFeedback = new LazyAction(
    lazyModule,
    m => m.postPersonalizationSuggestionFeedback
);
export let lazyPostPersonalizationUsageSignals = new LazyAction(
    lazyModule,
    m => m.postPersonalizationUsageSignals
);

export { ApplicationType, FeatureName } from './store/schema/PersonalizationSchema';
export type { SignalInfo, UsageSuggestion } from './store/schema/PersonalizationSchema';
export { default as getUsageSuggestions } from './selectors/getUsageSuggestions';
