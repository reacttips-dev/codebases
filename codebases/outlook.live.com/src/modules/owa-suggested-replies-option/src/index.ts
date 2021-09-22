import { LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "fms-action-providers" */ './lazyIndex')
);

export let lazyTurnSuggestedRepliesOnOff = new LazyImport(
    lazyModule,
    m => m.turnSuggestedRepliesOnOff
);

export { default as SuggestedRepliesOption } from './components/SuggestedRepliesOption';
