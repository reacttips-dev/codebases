import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ProjectionPopout" */ './lazyIndex')
);

export const ProjectionPopoutHost = createLazyComponent(lazyModule, m => m.ProjectionPopoutHost);
