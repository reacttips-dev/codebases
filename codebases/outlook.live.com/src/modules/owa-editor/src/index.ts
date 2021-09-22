import { createLazyComponent, LazyImport, LazyModule } from 'owa-bundling';
import type EditorViewState from './store/schema/EditorViewState';

export type { default as PluginWithViewState } from './store/schema/PluginWithViewState';
export type { default as PluginWithUI } from './store/schema/PluginWithUI';
export type { OperateContentType } from './utils/operateContent';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "HtmlEditor" */ './lazyIndex'));

export let ReactEditor = createLazyComponent(lazyModule, m => m.ReactEditor);
export let lazySetTableHeaderRow = new LazyImport(lazyModule, m => m.setTableHeaderRow);
export let lazyOperateContent = new LazyImport(lazyModule, m => m.operateContent);
export type { default as PluginViewStateAdapter } from './store/schema/PluginViewStateAdapter';
export type { default as EditorViewState } from './store/schema/EditorViewState';

export let lazyFocusToEditor = new LazyImport(lazyModule, m => m.focusToEditor);
export function focusToEditor(viewState: EditorViewState) {
    lazyFocusToEditor.import().then(focusToEditor => focusToEditor(viewState));
}
