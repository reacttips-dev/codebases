import './mutators/mailListItemMutators';
import { LazyAction, LazyModule } from 'owa-bundling';

export { expandRowFirstLevel, removeForksStoreUpdate } from './actions/mailListItemActions';
export { getConversationRelationMap } from './utils/conversationRelationMapUtils';
export { default as isHxForksEnabled } from './utils/isHxForksEnabled';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "mailStoreUnstacked" */ './lazyIndex')
);

export const lazyGetIdsForTriageActions = new LazyAction(lazyModule, m => m.getIdsForTriageActions);
