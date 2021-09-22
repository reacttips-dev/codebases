import { LazyImport, LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "LoadMailVotingProviders" */ './lazyIndex')
);

// Delayed loaded actions/functions
export const lazyLoadActiveVotingProviders = new LazyImport(
    lazyModule,
    m => m.loadActiveVotingProviders
);

export const lazyCastVoteForProvider = new LazyAction(lazyModule, m => m.castVoteForProvider);

export const VotingResultsCard = createLazyComponent(lazyModule, m => m.VotingResultsCard);

// Non-delayed loaded
export { default as createVotingInfoBarMessage } from './utils/createVotingInfoBarMessage';
