import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ConversationAttachment" */ './lazyIndex')
);

// Delayed Loaded Components
export const ConversationAttachmentWellButton = createLazyComponent(
    lazyModule,
    m => m.ConversationAttachmentWellButton
);
