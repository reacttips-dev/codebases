import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFolderView" */ './lazyIndex')
);

export let FavoritesPicker = createLazyComponent(lazyModule, m => m.FavoritesPicker);
