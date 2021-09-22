import {
    LazyModule,
    createLazyComponent,
    registerLazyOrchestrator,
    LazyImport,
} from 'owa-bundling';
import { initializeSharedFolderRoots } from 'owa-folders';

const lazyModule = new LazyModule(
    () => import(/*webpackChunkName: "SharedFolders"*/ './lazyIndex')
);

export const LazySharedFolderPeoplePicker = createLazyComponent(
    lazyModule,
    m => m.SharedFolderPeoplePicker
);
export const lazyShowSharedFolderPeoplePickerDialog = new LazyImport(
    lazyModule,
    m => m.showSharedFolderPeoplePickerDialog
);

export const lazyRemoveSharedFolderUser = new LazyImport(lazyModule, m => m.removeSharedFolderUser);

registerLazyOrchestrator(
    initializeSharedFolderRoots,
    lazyModule,
    m => m.initializeSharedFolderRootsOrchestrator
);
