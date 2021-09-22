import { createLazyComponent, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailCommandBarEditor"*/ './lazyIndex')
);

export { getStore } from './store/store';
export { default as shouldGoAboveDividerInCommandBarOverflowMenu } from './utils/shouldGoAboveDividerInCommandBarOverflowMenu';

// Delay loaded components
export const CommandBarEditorContainer = createLazyComponent(
    lazyModule,
    m => m.CommandBarEditorContainer
);

export const lazyOnOpenEditor = new LazyAction(lazyModule, m => m.onOpenEditor);
