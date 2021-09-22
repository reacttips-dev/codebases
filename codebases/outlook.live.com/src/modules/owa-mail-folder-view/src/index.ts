import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailFolderView" */ './lazyIndex')
);

export { default as FolderNode } from './components/FolderNode';
export { default as MailFolderList } from './components/MailFolderList';
export { default as MailFolderNode } from './components/MailFolderNode';
export { default as MailFolderNodeChildren } from './components/MailFolderNodeChildren';
export { default as MailFolderRoot } from './components/MailFolderRoot';

export type {
    default as MailFolderNodeTreeProps,
    RenderFolderNodeFunc,
} from './components/MailFolderNodeTreeProps';

export { DRAG_X_OFFSET, DRAG_Y_OFFSET } from './helpers/folderNodeDragConstants';

// Delay loaded components
export const MailFolderContextMenu = createLazyComponent(
    lazyModule,
    m => m.MailFolderContextMenuLegacy
);

export const lazySelfMountMoveToDialog = new LazyAction(
    new LazyModule(
        () =>
            import(
                /* webpackChunkName: "MountMoveFolderDialog"*/ './components/selfMountMoveToDialog'
            )
    ),
    m => m.selfMountMoveToDialog
);

export const FolderOperationNode = createLazyComponent(
    new LazyModule(
        () =>
            import(/* webpackChunkName: "FolderOperationNode"*/ './components/FolderOperationNode')
    ),
    m => m.default
);
