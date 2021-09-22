import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "WorkloadScenarioSettings"*/ './lazyIndex')
);

export const lazyLoadWorkloadScenarioSettings = new LazyAction(
    lazyModule,
    m => m.loadWorkloadScenarioSettings
);
