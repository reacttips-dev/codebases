import { LazyModule, createLazyComponent } from 'owa-bundling';

// Only load the code to display the error component in the rare cases where we actually encounter an error.
const desktopErrorComponentModule = new LazyModule(
    () => import(/*webpackChunkName: "DesktopErrorComponent" */ './DesktopErrorComponent')
);

export const DesktopErrorComponentAsync = createLazyComponent(
    desktopErrorComponentModule,
    m => m.default
);
