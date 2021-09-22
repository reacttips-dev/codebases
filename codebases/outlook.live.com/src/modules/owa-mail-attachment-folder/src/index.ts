import { createLazyComponent, LazyAction, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "attachmentFolder" */ './lazyIndex')
);

// delay loaded actions
export const lazyInitializeAttachmentsFolder = new LazyAction(
    lazyModule,
    m => m.initializeAttachmentsFolder
);

// exported types and actions
export { FilesTreeLoadState } from './types/FilesTreeLoadState';
export { onAttachmentLoadFailed, onAttachmentsRetrieved } from './actions/subscribableActions';

// delay loaded components
export const AttachmentFileNodeList = createLazyComponent(
    lazyModule,
    m => m.AttachmentFileNodeList
);
