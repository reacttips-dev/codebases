import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "OwaFluidDatapoints"*/ './lazyIndex')
);

export const lazyCreatePerfDatapoint = new LazyAction(lazyModule, m => m.createPerfDatapoint);
export const lazyDiscardPerfDatapoint = new LazyAction(lazyModule, m => m.discardPerfDatapoint);

export const OwaFluidPerfLoggingHelper = createLazyComponent(
    lazyModule,
    m => m.OwaFluidPerfLoggingHelper
);

export const lazyGetScenarioStartTime = new LazyAction(lazyModule, m => m.getScenarioStartTime);

export { OWAFluidCheckmarksEnum } from './utils/OWAFluidCheckmarksEnum';
export { reportPerfCheckmark } from './mutators/OwaFluidDatapointsMutators';
