import { LazyModule, LazyImport, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "UserVoice" */ './lazyIndex'));

export const lazyShowFeedbackMitigationDialog = new LazyImport(
    lazyModule,
    m => m.showFeedbackMitigationDialog
);

export const lazySetActionInfoState = new LazyAction(lazyModule, m => m.setActionInfoState);

export { getActionInfoAndSetStore } from './actions/getActionInfoAndSetStore';
export type { ActionInfo } from './store/schema/ActionInfo';
