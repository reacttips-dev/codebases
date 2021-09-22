import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SearchDiagnostics"*/ './lazyIndex')
);

export let SearchInlineFeedback = createLazyComponent(lazyModule, m => m.SearchInlineFeedback);

export { UserVoiceSearchTeam } from './components/UserVoiceSearchTeam';
