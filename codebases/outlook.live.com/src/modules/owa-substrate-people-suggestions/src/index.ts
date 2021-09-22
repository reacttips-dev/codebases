import { LazyAction, LazyModule } from 'owa-bundling';
export { default as addSessionMaskedRecipient } from './actions/addSessionMaskedRecipient';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SubstrateSuggestions"*/ './lazyIndex')
);

export const lazyExecute3SPrimeCall = new LazyAction(lazyModule, m => m.execute3SPrimeCall);
