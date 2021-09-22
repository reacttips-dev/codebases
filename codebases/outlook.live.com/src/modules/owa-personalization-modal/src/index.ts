import { LazyModule, LazyAction } from 'owa-bundling';

const personalizationLazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaPersonalizationModal" */ './lazyIndex')
);

export let lazyShowPersonalizationCard = new LazyAction(
    personalizationLazyModule,
    m => m.showPersonalizationCard
);
