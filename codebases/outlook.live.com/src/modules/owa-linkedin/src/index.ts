import { LazyAction, LazyModule } from 'owa-bundling';

import { completeLinkedInBind } from './utils/completeLinkedInBind';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "LinkedIn" */ './lazyIndex'));

export let connectToLinkedInLazy = new LazyAction(lazyModule, m => m.connectToLinkedIn);

export let initializeBindStatusLazy = new LazyAction(lazyModule, m => m.initializeBindStatus);

if (typeof window !== 'undefined' && typeof window.Owa !== 'undefined') {
    window.Owa.completeLinkedInBind = completeLinkedInBind;
}

export { isOptedOut } from './selectors/isOptedOut';
export { isBound } from './selectors/isBound';
