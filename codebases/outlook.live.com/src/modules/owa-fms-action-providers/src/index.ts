import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "fms-action-providers" */ './lazyIndex')
);

export const lazyGetActionByFilter = new LazyImport(lazyModule, m => m.getActionByFilter);

export { turnOffFocusedInbox } from './actions/turnOffFocusedInbox';
import './orchestrators/getActionInfoAndSetStoreOrchestrator';
