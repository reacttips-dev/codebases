import { createLazyComponent, LazyModule } from 'owa-bundling';

export const ArchiveMailFolderTreeContainer = createLazyComponent(
    new LazyModule(
        () =>
            import(
                /* webpackChunkName: "ArchiveMailFolderTree"*/ './ArchiveMailFolderTreeContainer'
            )
    ),
    m => m.default
);

export const SharedFolderTreeParentContainer = createLazyComponent(
    new LazyModule(
        () => import(/* webpackChunkName: "SharedFolderTree"*/ './SharedFolderTreeParentContainer')
    ),
    m => m.default
);
