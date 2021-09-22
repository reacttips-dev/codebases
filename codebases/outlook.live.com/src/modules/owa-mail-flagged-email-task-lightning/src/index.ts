import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFlaggedEmailLightning" */ './lazyIndex')
);

// Delayed Loaded Components
export const FlaggedEmailTaskLightning = createLazyComponent(
    lazyModule,
    m => m.FlaggedEmailTaskLightning
);
