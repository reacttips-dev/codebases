import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "SessionStore" */ './lazyIndex')
);

export const lazyUpdateUserConfigurationService = new LazyAction(
    lazyModule,
    m => m.updateUserConfigurationService
);
