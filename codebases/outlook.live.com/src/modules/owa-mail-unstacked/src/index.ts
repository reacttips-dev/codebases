import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "mailStoreUnstacked" */ './lazyIndex')
);

export const lazyIsReadingPaneConversationEnabled = new LazyImport(
    lazyModule,
    m => m.isReadingPaneConversationEnabled
);
