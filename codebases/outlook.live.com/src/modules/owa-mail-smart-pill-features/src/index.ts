import { LazyAction, LazyModule } from 'owa-bundling';

// Mutators
import './mutators/initializeSIGSDataMutator';

// Lazy
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SmartPillFeatures" */ './lazyIndex')
);

export let lazyLogToSIGSOnMessageSent = new LazyAction(lazyModule, m => m.logToSIGSOnMessageSent);

export { FeatureNames, FlightNames, GetItemManagerFeatureIds } from './utils/constants';
export type {
    SmartPillsAggregatedByFeature,
    SmartPillsFeatureArrangement,
} from './utils/constants';

export { default as createSmartPillViewState } from './utils/createSmartPillViewState';
