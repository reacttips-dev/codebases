import { LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailCommandBar"*/ './lazyIndex')
);

export const FolderPaneAutoCollapseFirstRunCallout = createLazyComponent(
    lazyModule,
    m => m.FolderPaneAutoCollapseFirstRunCallout
);
