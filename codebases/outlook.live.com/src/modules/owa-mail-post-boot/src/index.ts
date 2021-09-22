import { LazyAction, LazyBootModule } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "MailFunctionalBoot" */ './lazyIndex')
);

export let lazySetupMailModulePostRender = new LazyAction(
    lazyModule,
    m => m.setupMailModulePostRender
);
