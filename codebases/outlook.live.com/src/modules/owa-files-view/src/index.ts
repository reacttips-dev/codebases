import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';
import { lazyLoadItemsViewStrings } from 'owa-files-view-strings';

const lazyModule = new LazyModule(async () => {
    // We need to load the items-view strings before we invoke any of their components or functions
    await lazyLoadItemsViewStrings.importAndExecute();

    return import(/* webpackChunkName: "filesView"*/ './lazyIndex');
});

// Exported navigation function
export const lazyOnFilesViewNavigation = new LazyAction(lazyModule, m => m.onFilesViewNavigation);

// Exported components
export const LazyFilesViewList = createLazyComponent(lazyModule, m => m.FilesViewList);
export const LazyFilesViewCommandBar = createLazyComponent(lazyModule, m => m.FilesViewCommandBar);
