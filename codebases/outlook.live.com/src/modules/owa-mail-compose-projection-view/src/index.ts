import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailCompose" */ './lazyIndex')
);

// Delay loaded components
export const ProjectionCompose = createLazyComponent(lazyModule, m => m.ProjectionCompose);
