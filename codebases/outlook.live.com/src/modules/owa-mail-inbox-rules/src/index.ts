import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "InboxRule" */ './lazyIndex'));

export let lazyCreateRuleFromItem = new LazyImport(lazyModule, m => m.createRuleFromItem);
export let lazyCreateRuleFromRow = new LazyImport(lazyModule, m => m.createRuleFromRow);
