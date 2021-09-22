import { createLazyComponent, LazyModule, LazyImport } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "HtmlEditor2ndUI" */ './lazyIndex')
);

export let TextColorPicker = createLazyComponent(lazyModule, m => m.TextColorPicker);
export let BackColorPicker = createLazyComponent(lazyModule, m => m.BackColorPicker);
export let FontPicker = createLazyComponent(lazyModule, m => m.FontPicker);
export let FontNamePicker = createLazyComponent(lazyModule, m => m.FontNamePicker);
export let FontSizePicker = createLazyComponent(lazyModule, m => m.FontSizePicker);
export let CasePicker = createLazyComponent(lazyModule, m => m.CasePicker);
export let InsertTableCallout = createLazyComponent(lazyModule, m => m.InsertTableCallout);
export let lazyDisplayInsertLinkDialog = new LazyImport(lazyModule, m => m.displayInsertLinkDialog);
export let lazyShowImageAltTextDialog = new LazyImport(lazyModule, m => m.showImageAltTextDialog);
export let lazyShowCustomizedColorPickerDialog = new LazyImport(
    lazyModule,
    m => m.showCustomizedColorPickerDialog
);

export type { InsertLinkProperties } from './components/InsertLinkProperties';
export type { default as FontPickerProps } from './components/FontPickerProps';
export type { default as FontPickerViewState } from './store/schema/FontPickerViewState';
