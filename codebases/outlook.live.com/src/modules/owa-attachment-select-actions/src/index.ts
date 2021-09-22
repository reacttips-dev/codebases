import { LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "Attachments" */ './lazyIndex')
);

// Lazy actions
export const lazyClickAttachment = new LazyAction(lazyModule, m => m.clickAttachment)
    .importAndExecute;

export const lazyPreviewAttachment = new LazyAction(lazyModule, m => m.previewAttachment);

export { default as downloadAttachment } from './utils/downloadAttachment';
export type { default as PreviewContext } from './types/PreviewContext';
