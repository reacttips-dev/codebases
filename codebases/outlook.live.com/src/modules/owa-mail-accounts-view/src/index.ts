import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Accounts" */ './lazyIndex'));
export const AccountsTreeView = createLazyComponent(lazyModule, m => m.AccountsTreeView);
