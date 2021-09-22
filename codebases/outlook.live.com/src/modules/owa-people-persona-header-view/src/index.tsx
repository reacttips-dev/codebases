import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "PeopleExperiences"*/ './lazyIndex')
);

export type { default as HeaderButtonData } from './models/HeaderButtonData';

export let PersonaHeader = createLazyComponent(lazyModule, m => m.PersonaHeader);
export let MultiPersonaHeader = createLazyComponent(lazyModule, m => m.MultiPersonaHeader);
