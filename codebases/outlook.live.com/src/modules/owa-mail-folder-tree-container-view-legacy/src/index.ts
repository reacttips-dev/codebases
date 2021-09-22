import { LazyImport, LazyBootModule } from 'owa-bundling-light';

// We don't want this to be a lazy component because it needs to be loaded and ready to render
// during boot
export const lazyMailFolderTreesParentContainer = new LazyImport(
    new LazyBootModule(() => import(/* webpackChunkName: "MailFolderTreesParent" */ './lazyIndex')),
    m => m.MailFolderTreesParentContainer
);
