export { getStore, default as commandBarActionStore } from './store/store';
export { CommandBarAction } from './store/schema/CommandBarAction';
export { default as loadCommandBarActions } from './actions/loadCommandBarActions';
export { default as defaultCommandBarConfig } from './utils/defaultCommandBarConfig';

import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailCommandBar"*/ './lazyIndex')
);

export const lazySaveCommandBarActions = new LazyAction(lazyModule, m => m.saveCommandBarActions);

import './mutators/loadCommandBarActionsMutator';
