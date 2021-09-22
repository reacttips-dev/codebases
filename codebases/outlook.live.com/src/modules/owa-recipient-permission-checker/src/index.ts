import { LazyAction, LazyModule } from 'owa-bundling';
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "RecipientPermissionChecker" */ './lazyIndex')
);
export const lazyTryCheckPermForLinks = new LazyAction(lazyModule, m => m.tryCheckPermForLinks);
export const lazyTryCheckPermForOneLink = new LazyAction(lazyModule, m => m.tryCheckPermForOneLink);
export const lazyExpandGroupsAndSmallDLs = new LazyAction(
    lazyModule,
    m => m.expandGroupsAndSmallDLs
);
export const lazyOnRemoveLink = new LazyAction(lazyModule, m => m.onRemoveLink);
// Non-lazy action as the consumer: compose validSend wants to run code synchronously
export { composeGetHasSharingIssues } from './actions/publicActions';
export { default as isCheckPermPending } from './utils/isCheckPermPending';
