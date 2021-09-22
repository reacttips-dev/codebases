import { LazyImport, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FloodgateFeedback" */ './lazyIndex')
);

export const lazyLoadAndInitializeFloodgateEngine = new LazyAction(
    lazyModule,
    m => m.loadAndInitializeFloodgateEngine
);
export const lazyLogFloodgateActivity = new LazyImport(lazyModule, m => m.logFloodgateActivity);

export type { SurveyActivityType } from './schema/SurveyActivityType';
