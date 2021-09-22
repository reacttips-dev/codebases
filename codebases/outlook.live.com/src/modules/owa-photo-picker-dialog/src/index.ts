import './mutators/storeMutators';
import { LazyModule, LazyAction, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/*webpackChunkName: "PhotoPickerDialog"*/ './lazyIndex')
);

export let lazyMountAndShowPhotoPickerDialog = new LazyAction(
    lazyModule,
    m => m.mountAndShowPhotoPickerDialog
);

export let LazyPhotoPickerDialog = createLazyComponent(lazyModule, m => m.PhotoPickerDialog);
